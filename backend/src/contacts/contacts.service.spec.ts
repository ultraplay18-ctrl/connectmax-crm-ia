import { Test, TestingModule } from '@nestjs/testing';
import { ContactsService } from './contacts.service';
import { PrismaService } from '../database/prisma.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';

describe('ContactsService', () => {
  let service: ContactsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    contact: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  const mockAuditLogsService = {
    log: jest.fn(),
  };

  const mockSubscriptionsService = {
    checkContactLimit: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: AuditLogsService, useValue: mockAuditLogsService },
        { provide: SubscriptionsService, useValue: mockSubscriptionsService },
      ],
    }).compile();

    service = module.get<ContactsService>(ContactsService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um novo contato para a empresa tenant com sucesso', async () => {
      const dto = {
        name: 'Cliente Teste',
        email: 'cliente@teste.com',
        phone: '(11) 98888-7777',
        document: '123.456.789-00',
      };

      mockPrismaService.contact.findFirst.mockResolvedValue(null);
      mockPrismaService.contact.create.mockResolvedValue({ id: 'contact-1', companyId: 'tenant-1', ...dto });

      const result = await service.create('tenant-1', dto as any, 'user-1');

      expect(result).toHaveProperty('id', 'contact-1');
      expect(mockPrismaService.contact.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          companyId: 'tenant-1',
          name: 'Cliente Teste',
        }),
      });
      expect(mockAuditLogsService.log).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'CONTACT_CREATE', companyId: 'tenant-1' }),
      );
    });

    it('deve rejeitar cadastro se o documento (CPF/CNPJ) já existir na mesma empresa', async () => {
      const dto = { name: 'Cliente Duplicado', document: '111.222.333-44' };
      mockPrismaService.contact.findFirst.mockResolvedValue({ id: 'exist-1', companyId: 'tenant-1', document: '111.222.333-44' });

      await expect(service.create('tenant-1', dto as any)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne & Isolamento Multi-Tenant', () => {
    it('deve retornar o contato se pertencer à empresa tenant do usuário', async () => {
      const mockContact = { id: 'c-1', companyId: 'tenant-A', name: 'Cliente Tenant A' };
      mockPrismaService.contact.findUnique.mockResolvedValue(mockContact);

      const result = await service.findOne('c-1', 'tenant-A');
      expect(result.name).toBe('Cliente Tenant A');
    });

    it('deve lançar ForbiddenException ao tentar acessar contato de OUTRA empresa (Tenant B)', async () => {
      const mockContact = { id: 'c-1', companyId: 'tenant-OUTRA', name: 'Cliente Confidencial' };
      mockPrismaService.contact.findUnique.mockResolvedValue(mockContact);

      await expect(service.findOne('c-1', 'tenant-MINHA')).rejects.toThrow(ForbiddenException);
    });

    it('deve lançar NotFoundException se o contato não existir', async () => {
      mockPrismaService.contact.findUnique.mockResolvedValue(null);

      await expect(service.findOne('invalido', 'tenant-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('deve retornar contatos paginados com metadados corretos', async () => {
      const mockList = [{ id: '1', name: 'Ana' }, { id: '2', name: 'Bruno' }];
      mockPrismaService.contact.count.mockResolvedValue(2);
      mockPrismaService.contact.findMany.mockResolvedValue(mockList);

      const result = await service.findAll('tenant-1', { page: 1, limit: 10 });

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.meta.total).toBe(2);
      expect(result.data.length).toBe(2);
    });
  });
});
