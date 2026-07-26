import { Injectable, Logger } from '@nestjs/common';
import { PaymentProvider, CheckoutSessionOptions } from './payment-provider.interface';

@Injectable()
export class StripeProvider implements PaymentProvider {
  private readonly logger = new Logger(StripeProvider.name);

  async createCheckout(options: CheckoutSessionOptions) {
    this.logger.log(`[Stripe] Gerando checkout para a empresa ${options.companyId} no plano ${options.planName}`);
    
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      // Fallback simulado caso a variável de ambiente não esteja configurada
      const sessionId = `cs_stripe_mock_${Math.random().toString(36).substring(7)}`;
      return {
        sessionId,
        checkoutUrl: `/checkout?planId=${options.planId}&sessionId=${sessionId}&provider=STRIPE`,
      };
    }

    // Código real utilizando SDK do Stripe seria inicializado aqui:
    // const stripe = require('stripe')(stripeKey);
    // const session = await stripe.checkout.sessions.create({...});
    
    const sessionId = `cs_stripe_prod_${Math.random().toString(36).substring(7)}`;
    return {
      sessionId,
      checkoutUrl: `/checkout?planId=${options.planId}&sessionId=${sessionId}&provider=STRIPE`,
    };
  }

  async confirmPayment(companyId: string, planId: string, externalSubscriptionId: string, externalCustomerId?: string) {
    this.logger.log(`[Stripe] Confirmando pagamento de assinatura ${externalSubscriptionId} para o cliente ${externalCustomerId}`);
    return { success: true, provider: 'STRIPE', externalSubscriptionId, externalCustomerId };
  }

  async cancelSubscription(externalSubscriptionId: string) {
    this.logger.log(`[Stripe] Cancelando assinatura Stripe ${externalSubscriptionId}`);
    return { success: true, canceled: true };
  }

  async updatePlan(externalSubscriptionId: string, newPlanName: string) {
    this.logger.log(`[Stripe] Atualizando assinatura Stripe ${externalSubscriptionId} para o plano ${newPlanName}`);
    return { success: true };
  }
}
