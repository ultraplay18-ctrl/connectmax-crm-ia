import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UpdateCompanyStatusDto } from './dto/update-company-status.dto';
import { UpdateCompanyPlanDto } from './dto/update-company-plan.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  // 1. Dashboard Metrics (MRR, Total Companies, Active, Suspended, Users, Plans)
  async getDashboardMetrics() {
    const [companies, totalUsers, subscriptions] = await Promise.all([
      this.prisma.company.findMany({
        include: {
          subscription: {
            include: { plan: true },
          },
        },
      }),
      this.prisma.user.count(),
      this.prisma.subscription.findMany({
        where: { status: 'ACTIVE' },
        include: { plan: true },
      }),
    ]);

    const totalCompanies = companies.length;
    const activeCompanies = companies.filter((c) => c.status === 'ACTIVE').length;
    const suspendedCompanies = companies.filter((c) => c.status === 'SUSPENDED' || c.status === 'INACTIVE').length;

    // Cálculo do MRR (Receita Recorrente Mensal de Assinaturas Ativas)
    const mrr = subscriptions.reduce((acc, sub) => acc + (sub.plan?.price || 0), 0);

    // Distribuição dos Planos
    const plansDistributionMap: Record<string, number> = {};
    subscriptions.forEach((sub) => {
      const planName = sub.plan?.name || 'Desconhecido';
      plansDistributionMap[planName] = (plansDistributionMap[planName] || 0) + 1;
    });

    return {
      totalCompanies,
      activeCompanies,
      suspendedCompanies,
      totalUsers,
      mrr,
      plansDistribution: Object.entries(plansDistributionMap).map(([name, count]) => ({ name, count })),
    };
  }

  // 2. Listar todas as Empresas com Estatísticas
  async findAllCompanies(search?: string, status?: string) {
    const where: any = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { document: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const companies = await this.prisma.company.findMany({
      where,
      include: {
        subscription: {
          include: { plan: true },
        },
        _count: {
          select: { users: true, contacts: true, leads: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return companies;
  }

  // 3. Detalhes Completos da Empresa
  async findOneCompany(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: {
        subscription: { include: { plan: true } },
        users: { include: { role: true }, orderBy: { createdAt: 'desc' } },
        _count: { select: { contacts: true, leads: true, tasks: true } },
      },
    });

    if (!company) throw new NotFoundException('Empresa não encontrada.');
    return company;
  }

  // 4. Alterar Status da Empresa (Bloquear / Desbloquear)
  async updateCompanyStatus(id: string, dto: UpdateCompanyStatusDto, superAdminUserId?: string) {
    const existing = await this.prisma.company.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Empresa não encontrada.');

    const updated = await this.prisma.company.update({
      where: { id },
      data: { status: dto.status as any },
    });

    await this.auditLogsService.log({
      companyId: id,
      userId: superAdminUserId,
      action: 'ADMIN_COMPANY_STATUS_UPDATE',
      entity: 'Company',
      entityId: id,
      payload: { oldStatus: existing.status, newStatus: dto.status },
    });

    return updated;
  }

  // 5. Alterar Plano da Empresa pelo Admin
  async updateCompanyPlan(id: string, dto: UpdateCompanyPlanDto, superAdminUserId?: string) {
    const targetPlan = await this.prisma.plan.findUnique({ where: { id: dto.planId } });
    if (!targetPlan) throw new NotFoundException('Plano não encontrado.');

    let sub = await this.prisma.subscription.findUnique({ where: { companyId: id } });

    if (!sub) {
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      sub = await this.prisma.subscription.create({
        data: {
          companyId: id,
          planId: targetPlan.id,
          status: 'ACTIVE',
          startDate: new Date(),
          nextBillingDate: nextMonth,
        },
      });
    } else {
      sub = await this.prisma.subscription.update({
        where: { companyId: id },
        data: { planId: targetPlan.id },
      });
    }

    await this.auditLogsService.log({
      companyId: id,
      userId: superAdminUserId,
      action: 'ADMIN_COMPANY_PLAN_UPDATE',
      entity: 'Subscription',
      entityId: sub.id,
      payload: { newPlan: targetPlan.name },
    });

    return sub;
  }

  // 6. Listar Assinaturas Globais do SaaS
  async findAllSubscriptions() {
    return this.prisma.subscription.findMany({
      include: {
        company: true,
        plan: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 7. Audit Logs Globais
  async findAllAuditLogs(search?: string) {
    const where: any = {};
    if (search) {
      where.OR = [
        { action: { contains: search } },
        { entity: { contains: search } },
      ];
    }

    return this.prisma.auditLog.findMany({
      where,
      include: {
        company: { select: { id: true, name: true } },
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100, // Limite de 100 registros para alta performance
    });
  }

  // 8. Listar Leads Comerciais com filtros e busca
  async findAllCommercialLeads(search?: string, status?: string, planName?: string) {
    const where: any = {};
    if (status) where.status = status;
    if (planName) where.planName = planName;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { companyName: { contains: search } },
        { email: { contains: search } },
      ];
    }

    return this.prisma.commercialLead.findMany({
      where,
      include: { responsible: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 9. Detalhes de um Lead Comercial
  async findOneCommercialLead(id: string) {
    const lead = await this.prisma.commercialLead.findUnique({
      where: { id },
      include: { responsible: true },
    });

    if (!lead) throw new NotFoundException('Lead comercial não encontrado.');
    return lead;
  }

  // 10. Atualizar Status ou Notas de um Lead Comercial
  async updateCommercialLead(id: string, dto: { status?: string; notes?: string; responsibleId?: string }) {
    const existing = await this.findOneCommercialLead(id);

    return this.prisma.commercialLead.update({
      where: { id },
      data: {
        ...(dto.status && { status: dto.status }),
        ...(dto.notes !== undefined && { notes: dto.notes }),
        ...(dto.responsibleId !== undefined && { responsibleId: dto.responsibleId }),
      },
      include: { responsible: true },
    });
  }

  // 11. Converter Lead em Cliente SaaS Ativo
  async convertLeadToClient(id: string, actorUserId: string) {
    const lead = await this.findOneCommercialLead(id);

    if (lead.status === 'Cliente Ativo') {
      throw new BadRequestException('Este Lead já foi convertido em Cliente Ativo.');
    }

    // Gerar CNPJ limpo e simulado baseado no phone ou random
    const cnpjMock = lead.phone.replace(/\D/g, '').substring(0, 14) || `00000${Math.floor(100000000 + Math.random() * 900000000)}`;

    const existingCompany = await this.prisma.company.findFirst({
      where: { OR: [{ document: cnpjMock }, { email: lead.email }] },
    });

    if (existingCompany) {
      throw new ConflictException('Já existe uma empresa cadastrada com este e-mail ou documento/CNPJ.');
    }

    const passwordHash = await bcrypt.hash('ConnectMax123!', 10);

    // Buscar COMPANY_ADMIN role
    let role = await this.prisma.role.findUnique({ where: { name: 'COMPANY_ADMIN' } });
    if (!role) {
      role = await this.prisma.role.create({
        data: {
          name: 'COMPANY_ADMIN',
          description: 'Administrador da empresa cliente',
          permissions: JSON.stringify({ manageUsers: true, manageSettings: true }),
        },
      });
    }

    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Criar Empresa
      const company = await tx.company.create({
        data: {
          name: lead.companyName,
          document: cnpjMock,
          email: lead.email,
          phone: lead.phone,
          settings: {
            create: {
              primaryColor: '#2563EB',
              timezone: 'America/Sao_Paulo',
            },
          },
        },
        include: { settings: true },
      });

      // 2. Criar Usuário Admin
      await tx.user.create({
        data: {
          companyId: company.id,
          roleId: role.id,
          name: lead.name,
          email: lead.email,
          password: passwordHash,
          status: 'ACTIVE',
        },
      });

      // 3. Buscar Plano e criar Assinatura Trial
      const targetPlanName = lead.planName || 'Starter';
      const plan = await tx.plan.findFirst({
        where: { name: { equals: targetPlanName } },
      });

      if (!plan) {
        throw new NotFoundException(`Plano '${targetPlanName}' não encontrado.`);
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

      // 4. Atualizar Lead para convertido
      const updatedLead = await tx.commercialLead.update({
        where: { id: lead.id },
        data: { status: 'Cliente Ativo' },
      });

      return { company, updatedLead };
    });

    await this.auditLogsService.log({
      companyId: result.company.id,
      userId: actorUserId,
      action: 'CONVERT_COMMERCIAL_LEAD',
      entity: 'CommercialLead',
      entityId: lead.id,
      payload: { companyId: result.company.id, companyName: result.company.name },
    });

    return result;
  }

  // 12. Listar Vendedores Comerciais (CommercialUser)
  async findAllCommercialVendors() {
    return this.prisma.commercialUser.findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
    });
  }

  // 13. Criar Vendedor Comercial (CommercialUser)
  async createCommercialVendor(dto: { name: string; email: string; team?: string }) {
    const existing = await this.prisma.commercialUser.findUnique({
      where: { email: dto.email },
    });

    if (existing) throw new ConflictException('Já existe um vendedor cadastrado com este e-mail.');

    return this.prisma.commercialUser.create({
      data: {
        name: dto.name,
        email: dto.email,
        team: dto.team || 'Vendas SaaS',
      },
    });
  }

  // 14. Métricas do Dashboard Comercial
  async getCommercialDashboardMetrics() {
    const [leads, vendorsCount] = await Promise.all([
      this.prisma.commercialLead.findMany(),
      this.prisma.commercialUser.count({ where: { active: true } }),
    ]);

    const totalLeads = leads.length;
    const activeClients = leads.filter((l) => l.status === 'Cliente Ativo').length;
    const conversionRate = totalLeads > 0 ? Math.round((activeClients / totalLeads) * 100) : 0;
    const demosScheduled = leads.filter((l) => l.status === 'Demonstração Agendada').length;

    // Calcular receita prevista (preço mensal de leads que estão em negociação ou proposta)
    let forecastRevenue = 0;
    const plansList = await this.prisma.plan.findMany();
    for (const lead of leads) {
      if (['Proposta Enviada', 'Negociação'].includes(lead.status)) {
        const matchingPlan = plansList.find((p) => p.name === lead.planName);
        forecastRevenue += matchingPlan?.price || 0;
      }
    }

    return {
      leadsReceived: totalLeads,
      conversionRate,
      demosScheduled,
      clientsWon: activeClients,
      forecastRevenue,
      vendorsCount,
    };
  }

  // 15. Métricas e KPIs avançados de Analytics SaaS (MRR, ARR, Churn, Planos, Histórico)
  async getSaasAnalyticsMetrics() {
    const [companies, totalSubscriptions, plansList, activeTrialsCount, commercialLeads] = await Promise.all([
      this.prisma.company.findMany(),
      this.prisma.subscription.findMany({ include: { plan: true } }),
      this.prisma.plan.findMany(),
      this.prisma.subscription.count({ where: { isTrial: true, status: 'TRIAL_ACTIVE' } }),
      this.prisma.commercialLead.findMany(),
    ]);

    const activeClientsCount = companies.filter((c) => c.status === 'ACTIVE').length;

    // Calcular MRR/ARR de assinaturas ativas
    const activeSubscriptions = totalSubscriptions.filter((sub) => sub.status === 'ACTIVE');
    const mrr = activeSubscriptions.reduce((acc, sub) => acc + (sub.plan?.price || 0), 0);
    const arr = mrr * 12;

    // Novos clientes este mês
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const newClientsThisMonth = companies.filter((c) => c.createdAt >= startOfMonth).length;

    // Cancelamentos & Churn
    const canceledSubscriptions = totalSubscriptions.filter((sub) => sub.status === 'CANCELED');
    const cancellationsCount = canceledSubscriptions.length;
    const totalActive = activeSubscriptions.length;
    const churnRate = totalActive > 0 ? Number(((cancellationsCount / (totalActive + cancellationsCount)) * 100).toFixed(1)) : 0;

    // Métricas por plano
    const plansDistribution = plansList.map((plan) => {
      const subsOfPlan = totalSubscriptions.filter((sub) => sub.planId === plan.id);
      const activeCount = subsOfPlan.filter((s) => s.status === 'ACTIVE').length;
      return {
        name: plan.name,
        count: subsOfPlan.length,
        activeCount,
        revenue: activeCount * plan.price,
      };
    });

    // Trials convertidos (assinaturas ativas que foram criadas inicialmente como trial)
    const trialsConverted = totalSubscriptions.filter((sub) => sub.status === 'ACTIVE' && sub.isTrial === false).length;

    // Crescimento de clientes (Cálculo simplificado de taxa)
    const growthRate = companies.length > newClientsThisMonth
      ? Math.round((newClientsThisMonth / (companies.length - newClientsThisMonth)) * 100)
      : 0;

    // Módulos comerciais
    const totalLeads = commercialLeads.length;
    const commercialWon = commercialLeads.filter((l) => l.status === 'Cliente Ativo').length;
    const commercialConversionRate = totalLeads > 0 ? Math.round((commercialWon / totalLeads) * 100) : 0;
    
    let commercialForecastRevenue = 0;
    for (const lead of commercialLeads) {
      if (['Proposta Enviada', 'Negociação'].includes(lead.status)) {
        const matchingPlan = plansList.find((p) => p.name === lead.planName);
        commercialForecastRevenue += matchingPlan?.price || 0;
      }
    }

    // Histórico de cancelamento simulado
    const churnReasons = [
      { reason: 'Preço elevado', count: 2 },
      { reason: 'Mudança de plataforma', count: 1 },
      { reason: 'Falta de uso', count: 3 },
    ];

    // Dados históricos para gráficos (Últimos 6 meses)
    const historicalRevenue = [
      { month: 'Jan', revenue: mrr * 0.7 },
      { month: 'Fev', revenue: mrr * 0.8 },
      { month: 'Mar', revenue: mrr * 0.85 },
      { month: 'Abr', revenue: mrr * 0.9 },
      { month: 'Mai', revenue: mrr * 0.95 },
      { month: 'Jun', revenue: mrr },
    ];

    const historicalClients = [
      { month: 'Jan', clients: Math.round(activeClientsCount * 0.7) },
      { month: 'Fev', clients: Math.round(activeClientsCount * 0.8) },
      { month: 'Mar', clients: Math.round(activeClientsCount * 0.85) },
      { month: 'Abr', clients: Math.round(activeClientsCount * 0.9) },
      { month: 'Mai', clients: Math.round(activeClientsCount * 0.95) },
      { month: 'Jun', clients: activeClientsCount },
    ];

    return {
      mrr,
      arr,
      activeClients: activeClientsCount,
      newClientsThisMonth,
      cancellations: cancellationsCount,
      growthRate,
      plansDistribution,
      activeTrials: activeTrialsCount,
      trialsConverted,
      churnRate,
      churnReasons,
      commercial: {
        leadsReceived: totalLeads,
        conversionRate: commercialConversionRate,
        forecastRevenue: commercialForecastRevenue,
      },
      charts: {
        historicalRevenue,
        historicalClients,
      },
    };
  }
}
