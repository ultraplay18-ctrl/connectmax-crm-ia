import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterCompanyDto } from './dto/register-company.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import * as bcrypt from 'bcrypt';
import { SessionsService } from '../sessions/sessions.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { CreateCommercialLeadDto } from './dto/create-commercial-lead.dto';
import { EmailService } from '../common/services/email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly sessionsService: SessionsService,
    private readonly auditLogsService: AuditLogsService,
    private readonly emailService: EmailService,
  ) {}

  async registerCompany(dto: RegisterCompanyDto) {
    // Check if company document exists
    const existingCompany = await this.prisma.company.findUnique({
      where: { document: dto.document },
    });

    if (existingCompany) {
      throw new ConflictException('Já existe uma empresa cadastrada com este CNPJ.');
    }

    // Check if admin email exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.adminEmail },
    });

    if (existingUser) {
      throw new ConflictException('Já existe um usuário cadastrado com este e-mail.');
    }

    // Get COMPANY_ADMIN role
    let companyAdminRole = await this.prisma.role.findUnique({
      where: { name: 'COMPANY_ADMIN' },
    });

    if (!companyAdminRole) {
      companyAdminRole = await this.prisma.role.create({
        data: {
          name: 'COMPANY_ADMIN',
          description: 'Administrador da empresa cliente',
          permissions: JSON.stringify({ manageUsers: true, manageSettings: true }),
        },
      });
    }

    const passwordHash = await bcrypt.hash(dto.adminPassword, 10);

    // Create Company and Admin user in transaction
    const result = await this.prisma.$transaction(async (tx) => {
      const company = await tx.company.create({
        data: {
          name: dto.companyName,
          document: dto.document,
          email: dto.companyEmail,
          phone: dto.phone,
          settings: {
            create: {
              primaryColor: '#2563EB',
              timezone: 'America/Sao_Paulo',
            },
          },
        },
        include: { settings: true },
      });

      const user = await tx.user.create({
        data: {
          companyId: company.id,
          roleId: companyAdminRole.id,
          name: dto.adminName,
          email: dto.adminEmail,
          password: passwordHash,
          status: 'ACTIVE',
        },
        include: { role: true },
      });

      // Buscar o plano selecionado ou padrão (Starter)
      const targetPlanName = dto.planName || 'Starter';
      const plan = await tx.plan.findFirst({
        where: { name: { equals: targetPlanName } },
      });

      if (!plan) {
        throw new NotFoundException(`Plano comercial '${targetPlanName}' não encontrado.`);
      }

      const trialEnds = new Date();
      trialEnds.setDate(trialEnds.getDate() + 14);

      await tx.subscription.create({
        data: {
          companyId: company.id,
          planId: plan.id,
          status: 'TRIAL_ACTIVE' as any,
          isTrial: true,
          trialEndsAt: trialEnds,
          startDate: new Date(),
          nextBillingDate: trialEnds,
          paymentProvider: 'SIMULATED',
        },
      });

      return { company, user, trialEnds };
    });

    await this.auditLogsService.log({
      companyId: result.company.id,
      userId: result.user.id,
      action: 'REGISTER_COMPANY',
      entity: 'Company',
      entityId: result.company.id,
      payload: { companyName: dto.companyName, adminEmail: dto.adminEmail },
    });

    // Enviar e-mails transacionais
    await this.emailService.sendWelcomeEmail(dto.adminEmail, dto.adminName, dto.companyName);
    await this.emailService.sendTrialStarted(dto.adminEmail, dto.companyName, result.trialEnds);

    // Generate tokens
    const tokens = await this.generateTokens(result.user, result.company.id);

    return {
      message: 'Empresa e administrador cadastrados com sucesso!',
      company: result.company,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role.name,
        companyId: result.company.id,
        settings: result.company.settings,
      },
      ...tokens,
    };
  }

  async login(dto: LoginDto, ipAddress?: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        role: true,
        company: { include: { settings: true } },
      },
    });

    if (!user) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Sua conta de usuário está inativa ou pendente.');
    }

    if (user.company.status !== 'ACTIVE') {
      throw new UnauthorizedException('A empresa cadastrada está inativa ou suspensa.');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }

    const tokens = await this.generateTokens(user, user.companyId);

    await this.auditLogsService.log({
      companyId: user.companyId,
      userId: user.id,
      action: 'USER_LOGIN',
      entity: 'User',
      entityId: user.id,
      ipAddress,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
        companyId: user.companyId,
        companyName: user.company.name,
        settings: user.company.settings,
      },
      ...tokens,
    };
  }

  async refreshToken(dto: RefreshTokenDto) {
    const session = await this.sessionsService.findSessionByToken(dto.refreshToken);

    if (!session || new Date() > session.expiresAt) {
      if (session) {
        await this.sessionsService.revokeSession(dto.refreshToken);
      }
      throw new UnauthorizedException('Sessão expirada. Faça login novamente.');
    }

    const user = session.user;
    const tokens = await this.generateTokens(user, user.companyId);

    // Revoke old refresh token
    await this.sessionsService.revokeSession(dto.refreshToken);

    return tokens;
  }

  async logout(refreshToken: string, userId?: string, companyId?: string) {
    if (refreshToken) {
      await this.sessionsService.revokeSession(refreshToken);
    }
    if (userId) {
      await this.auditLogsService.log({
        companyId,
        userId,
        action: 'USER_LOGOUT',
        entity: 'User',
        entityId: userId,
      });
    }
    return { message: 'Logout realizado com sucesso.' };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (user) {
      await this.auditLogsService.log({
        companyId: user.companyId,
        userId: user.id,
        action: 'PASSWORD_RESET_REQUEST',
        entity: 'User',
        entityId: user.id,
      });
    }

    // Retorna mensagem padrão para evitar que amostragem revel os e-mails existentes
    return {
      message: 'Se este e-mail estiver cadastrado, você receberá as instruções para redefinição de senha.',
    };
  }

  async createCommercialLead(dto: CreateCommercialLeadDto) {
    return this.prisma.commercialLead.create({
      data: dto,
    });
  }

  private async generateTokens(user: any, companyId: string) {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      companyId,
      role: user.role?.name || user.role,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(
      { ...payload, jti: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}` },
      { expiresIn: '7d' },
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.sessionsService.createSession(user.id, refreshToken, expiresAt);

    return {
      accessToken,
      refreshToken,
      expiresIn: 86400, // 24h em segundos
    };
  }
}
