import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../database/prisma.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
  };

  const mockAuditLogsService = {
    log: jest.fn().mockResolvedValue(true),
  };

  const mockSubscriptionsService = {
    checkUserLimit: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: AuditLogsService, useValue: mockAuditLogsService },
        { provide: SubscriptionsService, useValue: mockSubscriptionsService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('deve retornar o perfil do usuário sem expor a senha hash', async () => {
      const mockUser = {
        id: 'u-1',
        name: 'Matheus Admin',
        email: 'admin@test.com',
        role: { name: 'COMPANY_ADMIN' },
        company: { name: 'Minha Empresa' },
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findOne('u-1');

      expect(result.name).toBe('Matheus Admin');
      expect(result).not.toHaveProperty('password');
    });

    it('deve lançar NotFoundException se o usuário não for encontrado', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.findOne('invalido')).rejects.toThrow(NotFoundException);
    });
  });
});
