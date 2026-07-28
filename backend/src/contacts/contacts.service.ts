import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

export interface ContactsQueryDto {
  search?: string;
  status?: string;
  type?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

@Injectable()
export class ContactsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogsService: AuditLogsService,
    private readonly subscriptionsService: SubscriptionsService,
  ) {}

  async create(companyId: string, dto: CreateContactDto, actorUserId?: string) {
    await this.subscriptionsService.checkContactLimit(companyId);

    const email = dto.email?.trim() || null;
    const document = dto.document?.trim() || null;

    // Duplicidade dentro do mesmo tenant
    if (document) {
      const existingDoc = await this.prisma.contact.findFirst({
        where: { companyId, document },
      });
      if (existingDoc) {
        throw new BadRequestException(`Já existe um cliente cadastrado com o documento (${document}) nesta empresa.`);
      }
    }

    if (email) {
      const existingEmail = await this.prisma.contact.findFirst({
        where: { companyId, email },
      });
      if (existingEmail) {
        throw new BadRequestException(`Já existe um cliente cadastrado com o e-mail (${email}) nesta empresa.`);
      }
    }

    const contact = await this.prisma.contact.create({
      data: {
        companyId,
        name: dto.name.trim(),
        email,
        phone: dto.phone?.trim() || null,
        document,
        type: dto.type || 'INDIVIDUAL',
        companyName: dto.companyName?.trim() || null,
        position: dto.position?.trim() || null,
        notes: dto.notes?.trim() || null,
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

  async findAll(companyId: string, query?: ContactsQueryDto) {
    const search = query?.search?.trim();
    const status = query?.status?.trim();
    const type = query?.type?.trim();
    const page = Math.max(1, Number(query?.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(query?.limit) || 10));
    const skip = (page - 1) * limit;

    const allowedSortFields = ['name', 'companyName', 'email', 'createdAt', 'status', 'type'];
    const sortBy = allowedSortFields.includes(query?.sortBy || '') ? (query?.sortBy as string) : 'createdAt';
    const sortOrder = query?.sortOrder === 'asc' ? 'asc' : 'desc';

    const whereCondition: any = { companyId };

    if (status) {
      whereCondition.status = status;
    }

    if (type) {
      whereCondition.type = type;
    }

    if (search) {
      whereCondition.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { document: { contains: search, mode: 'insensitive' } },
        { companyName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, data] = await Promise.all([
      this.prisma.contact.count({ where: whereCondition }),
      this.prisma.contact.findMany({
        where: whereCondition,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async getStats(companyId: string) {
    const [total, active, leads, inactive, companies, individuals] = await Promise.all([
      this.prisma.contact.count({ where: { companyId } }),
      this.prisma.contact.count({ where: { companyId, status: 'ACTIVE' } }),
      this.prisma.contact.count({ where: { companyId, status: 'LEAD' } }),
      this.prisma.contact.count({ where: { companyId, status: 'INACTIVE' } }),
      this.prisma.contact.count({ where: { companyId, type: 'COMPANY' } }),
      this.prisma.contact.count({ where: { companyId, type: 'INDIVIDUAL' } }),
    ]);

    return {
      total,
      active,
      leads,
      inactive,
      companies,
      individuals,
    };
  }

  async findOne(id: string, companyId: string, isSuperAdmin = false) {
    const contact = await this.prisma.contact.findUnique({
      where: { id },
    });

    if (!contact) {
      throw new NotFoundException('Cliente/Contato não encontrado.');
    }

    if (!isSuperAdmin && contact.companyId !== companyId) {
      throw new ForbiddenException('Acesso negado: Este contato pertence a outra empresa (Multi-Tenant).');
    }

    return contact;
  }

  async update(id: string, companyId: string, dto: UpdateContactDto, actorUserId?: string, isSuperAdmin = false) {
    const current = await this.findOne(id, companyId, isSuperAdmin);

    const updateData: any = {};
    if (dto.name !== undefined) updateData.name = dto.name.trim();

    if (dto.email !== undefined) {
      const email = dto.email ? dto.email.trim() : null;
      if (email && email !== current.email) {
        const existingEmail = await this.prisma.contact.findFirst({
          where: { companyId, email, id: { not: id } },
        });
        if (existingEmail) {
          throw new BadRequestException(`Já existe outro cliente cadastrado com o e-mail (${email}) nesta empresa.`);
        }
      }
      updateData.email = email;
    }

    if (dto.document !== undefined) {
      const document = dto.document ? dto.document.trim() : null;
      if (document && document !== current.document) {
        const existingDoc = await this.prisma.contact.findFirst({
          where: { companyId, document, id: { not: id } },
        });
        if (existingDoc) {
          throw new BadRequestException(`Já existe outro cliente cadastrado com o documento (${document}) nesta empresa.`);
        }
      }
      updateData.document = document;
    }

    if (dto.phone !== undefined) updateData.phone = dto.phone ? dto.phone.trim() : null;
    if (dto.type !== undefined) updateData.type = dto.type;
    if (dto.companyName !== undefined) updateData.companyName = dto.companyName ? dto.companyName.trim() : null;
    if (dto.position !== undefined) updateData.position = dto.position ? dto.position.trim() : null;
    if (dto.notes !== undefined) updateData.notes = dto.notes ? dto.notes.trim() : null;
    if (dto.status !== undefined) updateData.status = dto.status;

    const updated = await this.prisma.contact.update({
      where: { id },
      data: updateData,
    });

    await this.auditLogsService.log({
      companyId,
      userId: actorUserId,
      action: 'CONTACT_UPDATE',
      entity: 'Contact',
      entityId: id,
      payload: updateData,
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

    return { message: 'Cliente/Contato removido com sucesso.' };
  }
}
