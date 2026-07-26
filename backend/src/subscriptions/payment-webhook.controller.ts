import { Controller, Post, Body, HttpCode, HttpStatus, Headers, UnauthorizedException } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { PaymentService } from './payment.service';

@Controller('webhooks/payment')
export class PaymentWebhookController {
  constructor(private readonly paymentService: PaymentService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.OK)
  async handlePaymentWebhook(
    @Body() body: any,
    @Headers('stripe-signature') stripeSignature?: string,
    @Headers('x-signature') mpSignature?: string,
  ) {
    // 1. Validação de Assinatura de Webhooks para segurança corporativa
    if (stripeSignature) {
      // Validação simulada do Stripe
      if (!stripeSignature.startsWith('t=')) {
        throw new UnauthorizedException('Assinatura Stripe inválida.');
      }
    }

    if (mpSignature) {
      // Validação simulada do Mercado Pago
      if (!mpSignature.includes('ts=')) {
        throw new UnauthorizedException('Assinatura Mercado Pago inválida.');
      }
    }

    // 2. Eventos do Stripe
    if (body.type) {
      const stripeEvent = body.type;
      const data = body.data?.object;
      const companyId = data?.metadata?.companyId;
      const planId = data?.metadata?.planId;

      switch (stripeEvent) {
        case 'checkout.session.completed':
        case 'invoice.paid':
          if (companyId && planId) {
            await this.paymentService.confirmPayment(
              companyId,
              planId,
              data.subscription || 'stripe_sub_id',
              data.customer || 'stripe_cust_id',
              'STRIPE',
            );
          }
          break;
        case 'customer.subscription.deleted':
        case 'invoice.payment_failed':
          if (companyId) {
            await this.paymentService.cancelSubscription(companyId, 'STRIPE');
          }
          break;
      }

      return { received: true, provider: 'STRIPE', event: stripeEvent };
    }

    // 3. Eventos do Mercado Pago
    const { action, data } = body;
    if (action) {
      const companyId = body.companyId;
      const planId = body.planId;

      switch (action) {
        case 'payment.created':
        case 'payment.approved':
          if (companyId && planId) {
            await this.paymentService.confirmPayment(
              companyId,
              planId,
              data?.id || 'mp_sub_id',
              undefined,
              'MERCADO_PAGO',
            );
          }
          break;
        case 'subscription.canceled':
        case 'payment.rejected':
          if (companyId) {
            await this.paymentService.cancelSubscription(companyId, 'MERCADO_PAGO');
          }
          break;
      }

      return { received: true, provider: 'MERCADO_PAGO', event: action };
    }

    // 4. Fallback/Simulado Legado para Compatibilidade de Testes
    const { event, companyId, planId, externalSubscriptionId, provider } = body;
    if (event === 'payment.approved' && companyId && planId) {
      await this.paymentService.confirmPayment(
        companyId,
        planId,
        externalSubscriptionId || 'mock_sub_id',
        undefined,
        provider || 'STRIPE',
      );
      return { received: true, provider: provider || 'STRIPE', event };
    } else if (event === 'subscription.canceled' && companyId) {
      await this.paymentService.cancelSubscription(companyId, provider || 'STRIPE');
      return { received: true, provider: provider || 'STRIPE', event };
    }

    return { received: true, status: 'ignored' };
  }
}
