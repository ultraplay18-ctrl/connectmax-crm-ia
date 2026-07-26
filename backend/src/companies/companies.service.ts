import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class CompaniesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async create(dto: CreateCompanyDto, actorUserId?: string) {
    const existing = await this.prisma.company.findUnique({
      where: { document: dto.document },
    });

    if (existing) {
      throw new ConflictException('Já existe uma empresa cadastrada com este CNPJ.');
    }

    const company = await this.prisma.company.create({
      data: {
        name: dto.name,
        document: dto.document,
        email: dto.email,
        phone: dto.phone,
        settings: {
          create: {
            primaryColor: '#2563EB',
            timezone: 'America/Sao_Paulo',
          },
        },
      },
      include: {
        settings: true,
      },
    });

    await this.auditLogsService.log({
      companyId: company.id,
      userId: actorUserId,
      action: 'COMPANY_CREATE',
      entity: 'Company',
      entityId: company.id,
      payload: { name: company.name, document: company.document },
    });

    return company;
  }

  async findAll() {
    return this.prisma.company.findMany({
      include: {
        settings: true,
        _count: {
          select: { users: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: { settings: true },
    });

    if (!company) {
      throw new NotFoundException('Empresa não encontrada.');
    }

    return company;
  }

  async update(id: string, dto: UpdateCompanyDto, actorUserId?: string) {
    await this.findOne(id);

    const updated = await this.prisma.company.update({
      where: { id },
      data: dto,
      include: { settings: true },
    });

    await this.auditLogsService.log({
      companyId: id,
      userId: actorUserId,
      action: 'COMPANY_UPDATE',
      entity: 'Company',
      entityId: id,
      payload: dto,
    });

    return updated;
  }
}
