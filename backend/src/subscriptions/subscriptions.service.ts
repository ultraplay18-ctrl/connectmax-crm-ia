import { Injectable, OnModuleInit, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ChangePlanDto } from './dto/change-plan.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class SubscriptionsService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async onModuleInit() {
    try {
      await this.seedPlans();
    } catch (error: any) {
      console.warn('[SubscriptionsService] Aviso no seedPlans durante inicialização:', error?.message || error);
    }
  }

  // 1. Seed Inicial dos Planos Comercializados
  async seedPlans() {
    const defaultPlans = [
      {
        name: 'Starter',
        price: 99.0,
        billingCycle: 'MONTHLY',
        maxUsers: 3,
        maxContacts: 500,
        features: JSON.stringify([
          'Até 3 usuários',
          'Até 500 clientes/contatos',
          'Pipeline de Vendas Kanban',
          'Tarefas e Agenda básica',
          'Suporte via e-mail',
        ]),
      },
      {
        name: 'Professional',
        price: 299.0,
        billingCycle: 'MONTHLY',
        maxUsers: 10,
        maxContacts: 5000,
        features: JSON.stringify([
          'Até 10 usuários',
          'Até 5.000 clientes/contatos',
          'ConnectMax IA Assistente',
          'Qualificação automática de Leads',
          'Atendimento WhatsApp com IA',
          'Módulo Financeiro CRM completo',
        ]),
      },
      {
        name: 'Enterprise',
        price: 799.0,
        billingCycle: 'MONTHLY',
        maxUsers: -1, // Ilimitado
        maxContacts: 50000,
        features: JSON.stringify([
          'Usuários ilimitados',
          'Até 50.000 clientes/contatos',
          'Todas as funções da IA sem restrições',
          'Múltiplas caixas de WhatsApp',
          'Gestor de conta dedicado',
          'SLA de suporte prioritário 24/7',
        ]),
      },
    ];

    for (const p of defaultPlans) {
      const existing = await this.prisma.plan.findUnique({ where: { name: p.name } });
      if (!existing) {
        await this.prisma.plan.create({ data: p as any });
      } else {
        await this.prisma.plan.update({
          where: { id: existing.id },
          data: { price: p.price, features: p.features },
        });
      }
    }
  }

  // 2. Garantir que toda empresa tenha uma Assinatura (com Trial Gratuito de 14 Dias)
  async ensureCompanySubscription(companyId: string, initialPlanName = 'Starter') {
    let sub = await this.prisma.subscription.findUnique({
      where: { companyId },
      include: { plan: true },
    });

    if (!sub) {
      const plan =
        (await this.prisma.plan.findUnique({ where: { name: initialPlanName } })) ||
        (await this.prisma.plan.findUnique({ where: { name: 'Starter' } }));

      if (!plan) throw new NotFoundException('Plano comercial não encontrado.');

      const now = new Date();
      const trialEnds = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 dias de Trial

      sub = await this.prisma.subscription.create({
        data: {
          companyId,
          planId: plan.id,
          status: 'TRIAL_ACTIVE' as any,
          isTrial: true,
          trialEndsAt: trialEnds,
          startDate: now,
          nextBillingDate: trialEnds,
          paymentProvider: 'SIMULATED',
        },
        include: { plan: true },
      });
    }

    return sub;
  }

  // 3. Listar Planos Disponíveis
  async findAllPlans() {
    return this.prisma.plan.findMany({
      orderBy: { price: 'asc' },
    });
  }

  // 4. Obter Assinatura Atual, Período de Trial e Uso de Cotas
  async getMySubscription(companyId: string) {
    let sub = await this.ensureCompanySubscription(companyId);

    // Checar se o trial expirou e atualizar o status para EXPIRED automaticamente
    if (sub.isTrial && sub.trialEndsAt && new Date() > new Date(sub.trialEndsAt) && sub.status !== 'EXPIRED') {
      sub = await this.prisma.subscription.update({
        where: { id: sub.id },
        data: { status: 'EXPIRED' as any },
        include: { plan: true },
      });
    }

    const [usedUsers, usedContacts] = await Promise.all([
      this.prisma.user.count({ where: { companyId } }),
      this.prisma.contact.count({ where: { companyId } }),
    ]);

    const now = new Date().getTime();
    const trialEnd = sub.trialEndsAt ? new Date(sub.trialEndsAt).getTime() : now;
    const daysRemaining = Math.max(0, Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24)));

    return {
      subscription: sub,
      plan: sub.plan,
      trial: {
        isTrial: sub.isTrial,
        trialEndsAt: sub.trialEndsAt,
        daysRemaining,
      },
      usage: {
        users: {
          used: usedUsers,
          max: sub.plan.maxUsers,
          percentage: sub.plan.maxUsers === -1 ? 0 : Math.min(100, Math.round((usedUsers / sub.plan.maxUsers) * 100)),
        },
        contacts: {
          used: usedContacts,
          max: sub.plan.maxContacts,
          percentage: sub.plan.maxContacts === -1 ? 0 : Math.min(100, Math.round((usedContacts / sub.plan.maxContacts) * 100)),
        },
      },
    };
  }

  // 5. Verificação de Limites de Usuários por Tenant
  async checkUserLimit(companyId: string) {
    const { plan } = await this.getMySubscription(companyId);
    if (plan.maxUsers === -1) return; // Ilimitado

    const currentUsers = await this.prisma.user.count({ where: { companyId } });
    if (currentUsers >= plan.maxUsers) {
      throw new ForbiddenException(
        `Limite de usuários atingido para o plano ${plan.name} (${currentUsers}/${plan.maxUsers}). Faça upgrade no menu Assinatura.`,
      );
    }
  }

  // 6. Verificação de Limites de Contatos por Tenant
  async checkContactLimit(companyId: string) {
    const { plan } = await this.getMySubscription(companyId);
    if (plan.maxContacts === -1) return; // Ilimitado

    const currentContacts = await this.prisma.contact.count({ where: { companyId } });
    if (currentContacts >= plan.maxContacts) {
      throw new ForbiddenException(
        `Limite de contatos atingido para o plano ${plan.name} (${currentContacts}/${plan.maxContacts}). Faça upgrade no menu Assinatura.`,
      );
    }
  }

  // 7. Trocar / Fazer Upgrade de Plano
  async changePlan(companyId: string, actorUserId: string, dto: ChangePlanDto) {
    const targetPlan = await this.prisma.plan.findUnique({ where: { id: dto.planId } });
    if (!targetPlan) throw new NotFoundException('Plano de destino não encontrado.');

    const sub = await this.ensureCompanySubscription(companyId);

    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const updatedSub = await this.prisma.subscription.update({
      where: { companyId },
      data: {
        planId: targetPlan.id,
        status: 'ACTIVE',
        isTrial: false,
        nextBillingDate: nextMonth,
      },
      include: { plan: true },
    });

    await this.auditLogsService.log({
      companyId,
      userId: actorUserId,
      action: 'SUBSCRIPTION_PLAN_CHANGE',
      entity: 'Subscription',
      entityId: updatedSub.id,
      payload: { oldPlan: sub.plan.name, newPlan: targetPlan.name },
    });

    return updatedSub;
  }
}
