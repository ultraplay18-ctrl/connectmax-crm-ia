import { Controller, Post, Body, Headers, Logger } from '@nestjs/common';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { PrismaService } from '../database/prisma.service';

@Controller('webhooks')
export class PaymentWebhooksController {
  private readonly logger = new Logger(PaymentWebhooksController.name);

  constructor(
    private readonly subscriptionsService: SubscriptionsService,
    private readonly prisma: PrismaService,
  ) {}

  // 1. Webhook Stripe
  @Post('stripe')
  async handleStripeWebhook(@Body() payload: any, @Headers('stripe-signature') signature: string) {
    this.logger.log(`📥 Recebido Webhook do Stripe: evento "${payload.type || 'invoice.payment_succeeded'}"`);

    const companyId = payload.data?.object?.metadata?.companyId || payload.companyId;
    if (companyId) {
      await this.subscriptionsService.ensureCompanySubscription(companyId);

      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      await this.prisma.subscription.update({
        where: { companyId },
        data: {
          status: 'ACTIVE',
          nextBillingDate: nextMonth,
          paymentProvider: 'STRIPE',
        },
      });
      this.logger.log(`✅ Assinatura renovada via Stripe para a empresa: ${companyId}`);
    }

    return { received: true, provider: 'STRIPE' };
  }

  // 2. Webhook Mercado Pago
  @Post('mercadopago')
  async handleMercadoPagoWebhook(@Body() payload: any) {
    this.logger.log(`📥 Recebido Webhook do Mercado Pago: ação "${payload.action || 'payment.created'}"`);

    const companyId = payload.data?.companyId || payload.companyId;
    if (companyId) {
      await this.subscriptionsService.ensureCompanySubscription(companyId);

      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      await this.prisma.subscription.update({
        where: { companyId },
        data: {
          status: 'ACTIVE',
          nextBillingDate: nextMonth,
          paymentProvider: 'MERCADO_PAGO',
        },
      });
      this.logger.log(`✅ Assinatura renovada via Mercado Pago para a empresa: ${companyId}`);
    }

    return { received: true, provider: 'MERCADO_PAGO' };
  }
}
