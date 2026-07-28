import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { SessionsService } from '../sessions/sessions.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { EmailService } from '../common/services/email.service';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    company: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    role: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    plan: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    subscription: {
      create: jest.fn(),
    },
    companySettings: {
      create: jest.fn(),
    },
    session: {
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mocked_jwt_token'),
  };

  const mockSessionsService = {
    createSession: jest.fn().mockResolvedValue({ id: 'session-1', refreshToken: 'ref-1' }),
  };

  const mockAuditLogsService = {
    log: jest.fn().mockResolvedValue(true),
  };

  const mockEmailService = {
    sendWelcomeEmail: jest.fn().mockResolvedValue(true),
    sendPasswordResetEmail: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: SessionsService, useValue: mockSessionsService },
        { provide: AuditLogsService, useValue: mockAuditLogsService },
        { provide: EmailService, useValue: mockEmailService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('deve autenticar o usuário com credenciais válidas e retornar tokens', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        password: hashedPassword,
        name: 'Test User',
        status: 'ACTIVE',
        companyId: 'company-1',
        role: { name: 'COMPANY_ADMIN' },
        company: { name: 'Test Company', status: 'ACTIVE' },
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.login({ email: 'test@example.com', password: 'password123' });

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user.email).toBe('test@example.com');
      expect(result.user.companyName).toBe('Test Company');
    });

    it('deve lançar UnauthorizedException ao informar senha incorreta', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        password: hashedPassword,
        status: 'ACTIVE',
        company: { status: 'ACTIVE' },
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      await expect(service.login({ email: 'test@example.com', password: 'wrongpassword' })).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('deve lançar UnauthorizedException se o usuário não for encontrado', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.login({ email: 'notfound@example.com', password: 'password123' })).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('registerCompany', () => {
    it('deve lançar ConflictException se o CNPJ já estiver cadastrado', async () => {
      mockPrismaService.company.findUnique.mockResolvedValue({ id: 'comp-1', document: '12.345.678/0001-90' });

      await expect(
        service.registerCompany({
          companyName: 'Nova Empresa',
          document: '12.345.678/0001-90',
          companyEmail: 'empresa@test.com',
          phone: '(11) 99999-9999',
          adminName: 'Admin',
          adminEmail: 'admin@test.com',
          adminPassword: 'Password123!',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });
});
