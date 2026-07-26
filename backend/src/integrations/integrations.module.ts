import { Module } from '@nestjs/common';
import { AiProviderService } from './ai-provider.service';
import { WhatsappProviderService } from './whatsapp-provider.service';
import { PaymentWebhooksController } from './payment-webhooks.controller';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

@Module({
  imports: [SubscriptionsModule],
  controllers: [PaymentWebhooksController],
  providers: [AiProviderService, WhatsappProviderService],
  exports: [AiProviderService, WhatsappProviderService],
})
export class IntegrationsModule {}
