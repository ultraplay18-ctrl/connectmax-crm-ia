import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class ActivitiesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  // ==================== TAREFAS ====================
  async createTask(companyId: string, dto: CreateTaskDto, actorUserId?: string) {
    const task = await this.prisma.task.create({
      data: {
        companyId,
        contactId: dto.contactId || null,
        leadId: dto.leadId || null,
        assignedUserId: dto.assignedUserId || actorUserId || null,
        title: dto.title,
        description: dto.description || null,
        dueDate: new Date(dto.dueDate),
        priority: dto.priority || 'MEDIUM',
        status: dto.status || 'PENDING',
      },
      include: {
        contact: true,
        lead: true,
        assignedUser: { select: { id: true, name: true, email: true } },
      },
    });

    await this.auditLogsService.log({
      companyId,
      userId: actorUserId,
      action: 'TASK_CREATE',
      entity: 'Task',
      entityId: task.id,
      payload: { title: task.title, dueDate: task.dueDate },
    });

    return task;
  }

  async findAllTasks(companyId: string, status?: string, assignedUserId?: string) {
    const where: any = { companyId };
    if (status) where.status = status;
    if (assignedUserId) where.assignedUserId = assignedUserId;

    return this.prisma.task.findMany({
      where,
      include: {
        contact: true,
        lead: true,
        assignedUser: { select: { id: true, name: true, email: true } },
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  async updateTask(id: string, companyId: string, dto: UpdateTaskDto, actorUserId?: string, isSuperAdmin = false) {
    const existing = await this.prisma.task.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Tarefa não encontrada.');
    if (!isSuperAdmin && existing.companyId !== companyId) {
      throw new ForbiddenException('Acesso negado: Tarefa de outra empresa.');
    }

    const updated = await this.prisma.task.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.dueDate && { dueDate: new Date(dto.dueDate) }),
        ...(dto.priority && { priority: dto.priority }),
        ...(dto.status && { status: dto.status }),
        ...(dto.contactId !== undefined && { contactId: dto.contactId }),
        ...(dto.leadId !== undefined && { leadId: dto.leadId }),
        ...(dto.assignedUserId !== undefined && { assignedUserId: dto.assignedUserId }),
      },
      include: {
        contact: true,
        lead: true,
        assignedUser: { select: { id: true, name: true, email: true } },
      },
    });

    await this.auditLogsService.log({
      companyId,
      userId: actorUserId,
      action: 'TASK_UPDATE',
      entity: 'Task',
      entityId: id,
      payload: dto,
    });

    return updated;
  }

  async deleteTask(id: string, companyId: string, actorUserId?: string, isSuperAdmin = false) {
    const existing = await this.prisma.task.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Tarefa não encontrada.');
    if (!isSuperAdmin && existing.companyId !== companyId) {
      throw new ForbiddenException('Acesso negado: Tarefa de outra empresa.');
    }

    await this.prisma.task.delete({ where: { id } });
    return { message: 'Tarefa removida com sucesso.' };
  }

  // ==================== INTERAÇÕES ====================
  async createInteraction(companyId: string, userId: string, dto: CreateInteractionDto) {
    const interaction = await this.prisma.interaction.create({
      data: {
        companyId,
        userId,
        title: dto.title,
        description: dto.description || null,
        type: dto.type || 'NOTE',
        contactId: dto.contactId || null,
        leadId: dto.leadId || null,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        contact: true,
        lead: true,
      },
    });

    return interaction;
  }

  async findAllInteractions(companyId: string, contactId?: string, leadId?: string) {
    const where: any = { companyId };
    if (contactId) where.contactId = contactId;
    if (leadId) where.leadId = leadId;

    return this.prisma.interaction.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        contact: true,
        lead: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  // ==================== EVENTOS / AGENDA ====================
  async createEvent(companyId: string, dto: CreateEventDto, actorUserId?: string) {
    const event = await this.prisma.event.create({
      data: {
        companyId,
        contactId: dto.contactId || null,
        leadId: dto.leadId || null,
        assignedUserId: dto.assignedUserId || actorUserId || null,
        title: dto.title,
        description: dto.description || null,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        location: dto.location || null,
      },
      include: {
        contact: true,
        lead: true,
        assignedUser: { select: { id: true, name: true, email: true } },
      },
    });

    await this.auditLogsService.log({
      companyId,
      userId: actorUserId,
      action: 'EVENT_CREATE',
      entity: 'Event',
      entityId: event.id,
      payload: { title: event.title, startDate: event.startDate },
    });

    return event;
  }

  async findAllEvents(companyId: string, assignedUserId?: string) {
    const where: any = { companyId };
    if (assignedUserId) where.assignedUserId = assignedUserId;

    return this.prisma.event.findMany({
      where,
      include: {
        contact: true,
        lead: true,
        assignedUser: { select: { id: true, name: true, email: true } },
      },
      orderBy: { startDate: 'asc' },
    });
  }

  async updateEvent(id: string, companyId: string, dto: UpdateEventDto, actorUserId?: string, isSuperAdmin = false) {
    const existing = await this.prisma.event.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Evento não encontrado.');
    if (!isSuperAdmin && existing.companyId !== companyId) {
      throw new ForbiddenException('Acesso negado: Evento de outra empresa.');
    }

    const updated = await this.prisma.event.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.startDate && { startDate: new Date(dto.startDate) }),
        ...(dto.endDate && { endDate: new Date(dto.endDate) }),
        ...(dto.location !== undefined && { location: dto.location }),
        ...(dto.contactId !== undefined && { contactId: dto.contactId }),
        ...(dto.leadId !== undefined && { leadId: dto.leadId }),
        ...(dto.assignedUserId !== undefined && { assignedUserId: dto.assignedUserId }),
      },
      include: {
        contact: true,
        lead: true,
        assignedUser: { select: { id: true, name: true, email: true } },
      },
    });

    return updated;
  }

  async deleteEvent(id: string, companyId: string, actorUserId?: string, isSuperAdmin = false) {
    const existing = await this.prisma.event.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Evento não encontrado.');
    if (!isSuperAdmin && existing.companyId !== companyId) {
      throw new ForbiddenException('Acesso negado: Evento de outra empresa.');
    }

    await this.prisma.event.delete({ where: { id } });
    return { message: 'Evento removido com sucesso.' };
  }
}
