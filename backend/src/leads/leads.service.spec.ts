import { Test, TestingModule } from '@nestjs/testing';
import { LeadsService } from './leads.service';
import { PrismaService } from '../database/prisma.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { ForbiddenException } from '@nestjs/common';

describe('LeadsService', () => {
  let service: LeadsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    lead: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  const mockAuditLogsService = {
    log: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeadsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: AuditLogsService, useValue: mockAuditLogsService },
      ],
    }).compile();

    service = module.get<LeadsService>(LeadsService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um lead associado ao tenant com sucesso', async () => {
      const dto = { title: 'Oportunidade SaaS', value: 50000, status: 'NEW_LEAD' };
      mockPrismaService.lead.create.mockResolvedValue({ id: 'lead-1', companyId: 'tenant-1', ...dto });

      const result = await service.create('tenant-1', dto as any, 'user-1');

      expect(result).toHaveProperty('id', 'lead-1');
      expect(mockPrismaService.lead.create).toHaveBeenCalled();
    });
  });

  describe('findOne Multi-Tenant Boundary', () => {
    it('deve rejeitar acesso se o lead pertencer a outro tenant', async () => {
      mockPrismaService.lead.findUnique.mockResolvedValue({ id: 'lead-99', companyId: 'tenant-B' });

      await expect(service.findOne('lead-99', 'tenant-A')).rejects.toThrow(ForbiddenException);
    });
  });
});
