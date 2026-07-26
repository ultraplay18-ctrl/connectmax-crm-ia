import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

export interface CreateAuditLogDto {
  companyId?: string;
  userId?: string;
  action: string;
  entity: string;
  entityId?: string;
  payload?: any;
  ipAddress?: string;
}

@Injectable()
export class AuditLogsService {
  constructor(private readonly prisma: PrismaService) {}

  async log(dto: CreateAuditLogDto) {
    try {
      const payloadString =
        dto.payload !== undefined && dto.payload !== null
          ? typeof dto.payload === 'string'
            ? dto.payload
            : JSON.stringify(dto.payload)
          : null;

      return await this.prisma.auditLog.create({
        data: {
          companyId: dto.companyId || null,
          userId: dto.userId || null,
          action: dto.action,
          entity: dto.entity,
          entityId: dto.entityId || null,
          payload: payloadString,
          ipAddress: dto.ipAddress || null,
        },
      });
    } catch (e) {
      console.error('Erro ao gravar log de auditoria:', e);
    }
  }

  async findAll(companyId?: string, isSuperAdmin = false) {
    const whereCondition = isSuperAdmin && !companyId ? {} : { companyId };

    return this.prisma.auditLog.findMany({
      where: whereCondition,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100,
    });
  }
}
