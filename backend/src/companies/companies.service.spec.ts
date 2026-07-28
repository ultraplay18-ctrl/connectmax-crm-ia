import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesService } from './companies.service';
import { PrismaService } from '../database/prisma.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { NotFoundException } from '@nestjs/common';

describe('CompaniesService', () => {
  let service: CompaniesService;
  let prisma: PrismaService;

  const mockPrismaService = {
    company: {
      findUnique: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
    companySettings: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
    },
  };

  const mockAuditLogsService = {
    log: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: AuditLogsService, useValue: mockAuditLogsService },
      ],
    }).compile();

    service = module.get<CompaniesService>(CompaniesService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('deve retornar os dados da empresa tenant', async () => {
      const mockCompany = { id: 'comp-1', name: 'ConnectMax Teste', document: '12.345.678/0001-90' };
      mockPrismaService.company.findUnique.mockResolvedValue(mockCompany);

      const result = await service.findOne('comp-1');

      expect(result.name).toBe('ConnectMax Teste');
    });

    it('deve lançar NotFoundException se a empresa não for encontrada', async () => {
      mockPrismaService.company.findUnique.mockResolvedValue(null);

      await expect(service.findOne('invalido')).rejects.toThrow(NotFoundException);
    });
  });
});
