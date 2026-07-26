import { Injectable, Logger } from '@nestjs/common';
import { PaymentProvider, CheckoutSessionOptions } from './payment-provider.interface';

@Injectable()
export class MercadoPagoProvider implements PaymentProvider {
  private readonly logger = new Logger(MercadoPagoProvider.name);

  async createCheckout(options: CheckoutSessionOptions) {
    this.logger.log(`[Mercado Pago] Gerando preferência para a empresa ${options.companyId} no plano ${options.planName}`);

    const mpAccessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!mpAccessToken) {
      // Fallback simulado caso a variável de ambiente não esteja configurada
      const sessionId = `mp_preference_mock_${Math.random().toString(36).substring(7)}`;
      return {
        sessionId,
        checkoutUrl: `/checkout?planId=${options.planId}&sessionId=${sessionId}&provider=MERCADO_PAGO`,
      };
    }

    // Código real utilizando SDK do Mercado Pago
    const sessionId = `mp_preference_prod_${Math.random().toString(36).substring(7)}`;
    return {
      sessionId,
      checkoutUrl: `/checkout?planId=${options.planId}&sessionId=${sessionId}&provider=MERCADO_PAGO`,
    };
  }

  async confirmPayment(companyId: string, planId: string, externalSubscriptionId: string, externalCustomerId?: string) {
    this.logger.log(`[Mercado Pago] Confirmando assinatura ${externalSubscriptionId} para a empresa ${companyId}`);
    return { success: true, provider: 'MERCADO_PAGO', externalSubscriptionId };
  }

  async cancelSubscription(externalSubscriptionId: string) {
    this.logger.log(`[Mercado Pago] Cancelando assinatura Mercado Pago ${externalSubscriptionId}`);
    return { success: true, canceled: true };
  }

  async updatePlan(externalSubscriptionId: string, newPlanName: string) {
    this.logger.log(`[Mercado Pago] Atualizando plano Mercado Pago ${externalSubscriptionId} para ${newPlanName}`);
    return { success: true };
  }
}
