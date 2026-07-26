import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { PaymentService } from './payment.service';
import { SubscriptionsController } from './subscriptions.controller';
import { PaymentWebhookController } from './payment-webhook.controller';
import { StripeProvider } from './gateways/stripe.provider';
import { MercadoPagoProvider } from './gateways/mercadopago.provider';

@Module({
  controllers: [SubscriptionsController, PaymentWebhookController],
  providers: [SubscriptionsService, PaymentService, StripeProvider, MercadoPagoProvider],
  exports: [SubscriptionsService, PaymentService, StripeProvider, MercadoPagoProvider],
})
export class SubscriptionsModule {}
