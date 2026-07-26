import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { StripeProvider } from './gateways/stripe.provider';
import { MercadoPagoProvider } from './gateways/mercadopago.provider';

@Injectable()
export class PaymentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stripeProvider: StripeProvider,
    private readonly mpProvider: MercadoPagoProvider,
  ) {}

  getProvider(providerName: string) {
    if (providerName === 'STRIPE') return this.stripeProvider;
    if (providerName === 'MERCADO_PAGO') return this.mpProvider;
    return this.stripeProvider; // Provedor padrão
  }

  async createCheckoutSession(companyId: string, planId: string, providerName = 'STRIPE') {
    const plan = await this.prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      throw new NotFoundException('Plano não encontrado.');
    }

    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException('Empresa não encontrada.');
    }

    const provider = this.getProvider(providerName);
    return provider.createCheckout({
      companyId,
      planId,
      planName: plan.name,
      price: plan.price,
      email: company.email,
    });
  }

  async confirmPayment(
    companyId: string,
    planId: string,
    externalSubscriptionId: string,
    externalCustomerId?: string,
    providerName = 'STRIPE',
  ) {
    const plan = await this.prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      throw new NotFoundException('Plano não encontrado.');
    }

    const billingCycleEnds = new Date();
    billingCycleEnds.setDate(billingCycleEnds.getDate() + 30); // Ciclo de 30 dias

    // 1. Confirmar com o gateway
    const provider = this.getProvider(providerName);
    await provider.confirmPayment(companyId, planId, externalSubscriptionId, externalCustomerId);

    // 2. Atualizar ou criar assinatura no banco
    const subscription = await this.prisma.subscription.upsert({
      where: { companyId },
      update: {
        planId,
        status: 'ACTIVE',
        isTrial: false,
        trialEndsAt: null,
        startDate: new Date(),
        nextBillingDate: billingCycleEnds,
        lastPaymentDate: new Date(),
        paymentProvider: providerName,
        externalSubscriptionId,
        externalCustomerId,
      },
      create: {
        companyId,
        planId,
        status: 'ACTIVE',
        isTrial: false,
        trialEndsAt: null,
        startDate: new Date(),
        nextBillingDate: billingCycleEnds,
        lastPaymentDate: new Date(),
        paymentProvider: providerName,
        externalSubscriptionId,
        externalCustomerId,
      },
    });

    // 3. Salvar histórico de faturamento (PaymentHistory)
    await this.prisma.paymentHistory.create({
      data: {
        companyId,
        subscriptionId: subscription.id,
        amount: plan.price,
        status: 'APPROVED',
        provider: providerName,
        transactionId: externalSubscriptionId,
      },
    });

    return subscription;
  }

  async cancelSubscription(companyId: string, providerName = 'STRIPE') {
    const sub = await this.prisma.subscription.findUnique({
      where: { companyId },
    });

    if (sub?.externalSubscriptionId) {
      const provider = this.getProvider(providerName);
      await provider.cancelSubscription(sub.externalSubscriptionId);
    }

    return this.prisma.subscription.update({
      where: { companyId },
      data: {
        status: 'CANCELED',
        isTrial: false,
      },
    });
  }

  async updatePlan(companyId: string, planId: string, providerName = 'STRIPE') {
    const sub = await this.prisma.subscription.findUnique({
      where: { companyId },
    });

    const plan = await this.prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      throw new NotFoundException('Plano não encontrado.');
    }

    if (sub?.externalSubscriptionId) {
      const provider = this.getProvider(providerName);
      await provider.updatePlan(sub.externalSubscriptionId, plan.name);
    }

    return this.prisma.subscription.update({
      where: { companyId },
      data: {
        planId,
      },
    });
  }
}
