import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

@Injectable()
export class ContactsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogsService: AuditLogsService,
    private readonly subscriptionsService: SubscriptionsService,
  ) {}

  async create(companyId: string, dto: CreateContactDto, actorUserId?: string) {
    await this.subscriptionsService.checkContactLimit(companyId);

    const contact = await this.prisma.contact.create({
      data: {
        companyId,
        name: dto.name,
        email: dto.email || null,
        phone: dto.phone || null,
        document: dto.document || null,
        type: dto.type || 'INDIVIDUAL',
        companyName: dto.companyName || null,
        position: dto.position || null,
        notes: dto.notes || null,
        status: dto.status || 'ACTIVE',
      },
    });

    await this.auditLogsService.log({
      companyId,
      userId: actorUserId,
      action: 'CONTACT_CREATE',
      entity: 'Contact',
      entityId: contact.id,
      payload: { name: contact.name, email: contact.email },
    });

    return contact;
  }

  async findAll(companyId: string, search?: string, status?: string) {
    const whereCondition: any = { companyId };

    if (status) {
      whereCondition.status = status;
    }

    if (search) {
      whereCondition.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
        { document: { contains: search } },
        { companyName: { contains: search } },
      ];
    }

    return this.prisma.contact.findMany({
      where: whereCondition,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, companyId: string, isSuperAdmin = false) {
    const contact = await this.prisma.contact.findUnique({
      where: { id },
    });

    if (!contact) {
      throw new NotFoundException('Contato não encontrado.');
    }

    if (!isSuperAdmin && contact.companyId !== companyId) {
      throw new ForbiddenException('Acesso negado: Este contato pertence a outra empresa (Multi-Tenant).');
    }

    return contact;
  }

  async update(id: string, companyId: string, dto: UpdateContactDto, actorUserId?: string, isSuperAdmin = false) {
    await this.findOne(id, companyId, isSuperAdmin);

    const updated = await this.prisma.contact.update({
      where: { id },
      data: dto,
    });

    await this.auditLogsService.log({
      companyId,
      userId: actorUserId,
      action: 'CONTACT_UPDATE',
      entity: 'Contact',
      entityId: id,
      payload: dto,
    });

    return updated;
  }

  async remove(id: string, companyId: string, actorUserId?: string, isSuperAdmin = false) {
    const contact = await this.findOne(id, companyId, isSuperAdmin);

    await this.prisma.contact.delete({
      where: { id },
    });

    await this.auditLogsService.log({
      companyId,
      userId: actorUserId,
      action: 'CONTACT_DELETE',
      entity: 'Contact',
      entityId: id,
      payload: { name: contact.name },
    });

    return { message: 'Contato removido com sucesso.' };
  }
}
