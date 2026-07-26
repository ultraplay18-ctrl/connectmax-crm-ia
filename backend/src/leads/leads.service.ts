import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { UpdateLeadStatusDto } from './dto/update-lead-status.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class LeadsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async create(companyId: string, dto: CreateLeadDto, actorUserId?: string) {
    const lead = await this.prisma.lead.create({
      data: {
        companyId,
        contactId: dto.contactId || null,
        assignedUserId: dto.assignedUserId || actorUserId || null,
        title: dto.title,
        source: dto.source || null,
        status: dto.status || 'NEW_LEAD',
        value: dto.value || 0,
        notes: dto.notes || null,
      },
      include: {
        contact: true,
        assignedUser: { select: { id: true, name: true, email: true } },
      },
    });

    await this.auditLogsService.log({
      companyId,
      userId: actorUserId,
      action: 'LEAD_CREATE',
      entity: 'Lead',
      entityId: lead.id,
      payload: { title: lead.title, status: lead.status, value: lead.value },
    });

    return lead;
  }

  async findAll(companyId: string, search?: string, status?: string, assignedUserId?: string) {
    const whereCondition: any = { companyId };

    if (status) {
      whereCondition.status = status;
    }

    if (assignedUserId) {
      whereCondition.assignedUserId = assignedUserId;
    }

    if (search) {
      whereCondition.OR = [
        { title: { contains: search } },
        { source: { contains: search } },
        { contact: { name: { contains: search } } },
      ];
    }

    return this.prisma.lead.findMany({
      where: whereCondition,
      include: {
        contact: true,
        assignedUser: { select: { id: true, name: true, email: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: string, companyId: string, isSuperAdmin = false) {
    const lead = await this.prisma.lead.findUnique({
      where: { id },
      include: {
        contact: true,
        assignedUser: { select: { id: true, name: true, email: true } },
      },
    });

    if (!lead) {
      throw new NotFoundException('Oportunidade não encontrada.');
    }

    if (!isSuperAdmin && lead.companyId !== companyId) {
      throw new ForbiddenException('Acesso negado: Esta oportunidade pertence a outra empresa (Multi-Tenant).');
    }

    return lead;
  }

  async update(id: string, companyId: string, dto: UpdateLeadDto, actorUserId?: string, isSuperAdmin = false) {
    await this.findOne(id, companyId, isSuperAdmin);

    const updated = await this.prisma.lead.update({
      where: { id },
      data: dto,
      include: {
        contact: true,
        assignedUser: { select: { id: true, name: true, email: true } },
      },
    });

    await this.auditLogsService.log({
      companyId,
      userId: actorUserId,
      action: 'LEAD_UPDATE',
      entity: 'Lead',
      entityId: id,
      payload: dto,
    });

    return updated;
  }

  async updateStatus(id: string, companyId: string, dto: UpdateLeadStatusDto, actorUserId?: string, isSuperAdmin = false) {
    const existing = await this.findOne(id, companyId, isSuperAdmin);

    const updated = await this.prisma.lead.update({
      where: { id },
      data: { status: dto.status },
      include: {
        contact: true,
        assignedUser: { select: { id: true, name: true, email: true } },
      },
    });

    await this.auditLogsService.log({
      companyId,
      userId: actorUserId,
      action: 'LEAD_STAGE_CHANGE',
      entity: 'Lead',
      entityId: id,
      payload: { from: existing.status, to: dto.status },
    });

    return updated;
  }

  async remove(id: string, companyId: string, actorUserId?: string, isSuperAdmin = false) {
    const lead = await this.findOne(id, companyId, isSuperAdmin);

    await this.prisma.lead.delete({
      where: { id },
    });

    await this.auditLogsService.log({
      companyId,
      userId: actorUserId,
      action: 'LEAD_DELETE',
      entity: 'Lead',
      entityId: id,
      payload: { title: lead.title },
    });

    return { message: 'Oportunidade removida com sucesso.' };
  }
}
