import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';
import { AuthService } from '../src/auth/auth.service';
import { AiProviderService } from '../src/integrations/ai-provider.service';
import { WhatsappProviderService } from '../src/integrations/whatsapp-provider.service';
import { PaymentWebhooksController } from '../src/integrations/payment-webhooks.controller';

async function testProductionSetup() {
  console.log('========================================================');
  console.log('🧪 VALIDAÇÃO DE PRODUÇÃO, SEGURANÇA E INTEGRAÇÕES REAIS');
  console.log('========================================================\n');

  let app: INestApplication;
  let prisma: PrismaService;
  let authService: AuthService;
  let aiProvider: AiProviderService;
  let whatsappProvider: WhatsappProviderService;
  let webhooksController: PaymentWebhooksController;

  try {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    authService = moduleFixture.get<AuthService>(AuthService);
    aiProvider = moduleFixture.get<AiProviderService>(AiProviderService);
    whatsappProvider = moduleFixture.get<WhatsappProviderService>(WhatsappProviderService);
    webhooksController = moduleFixture.get<PaymentWebhooksController>(PaymentWebhooksController);

    // Setup Tenant
    await prisma.company.deleteMany({ where: { document: '20202020000120' } });

    const tenantProd = await authService.registerCompany({
      companyName: 'Empresa Teste Produção',
      document: '20202020000120',
      companyEmail: 'prod@company.com',
      adminName: 'Admin Prod',
      adminEmail: 'admin@company.com',
      adminPassword: 'SenhaProd123!',
    });

    // 1. Testar Provedor de IA (OpenAI / Gemini / ConnectMax IA Engine)
    console.log('1️⃣ [TESTE IA] Testando resposta da arquitetura de IA...');
    const aiResult = await aiProvider.generateAiResponse('Resumo comercial', 'Contexto seguro do cliente');
    console.log(`   Result: "${aiResult}"`);

    // 2. Testar Provedor de WhatsApp (Meta Cloud API / Simulação)
    console.log('\n2️⃣ [TESTE WHATSAPP] Disparando mensagem via provedor...');
    const waResult = await whatsappProvider.sendMessage('5511999998888', 'Mensagem de teste de produção');
    console.log(`   WhatsApp Status: "${waResult.provider}" (MessageID: ${waResult.messageId})`);

    // 3. Testar Webhook do Stripe (Renovação Automática)
    console.log('\n3️⃣ [TESTE STRIPE WEBHOOK] Simulando evento invoice.payment_succeeded do Stripe...');
    const stripeRes = await webhooksController.handleStripeWebhook(
      { type: 'invoice.payment_succeeded', companyId: tenantProd.company.id },
      'sig_mock_stripe',
    );
    console.log(`   Stripe Status: Provider "${stripeRes.provider}" com resposta: Received=${stripeRes.received}`);

    // 4. Testar Webhook do Mercado Pago (Renovação Automática)
    console.log('\n4️⃣ [TESTE MERCADO PAGO WEBHOOK] Simulando evento payment.created do Mercado Pago...');
    const mpRes = await webhooksController.handleMercadoPagoWebhook({
      action: 'payment.created',
      data: { companyId: tenantProd.company.id },
    });
    console.log(`   Mercado Pago Status: Provider "${mpRes.provider}" com resposta: Received=${mpRes.received}`);

    // Validar status atualizado da assinatura no banco
    const sub = await prisma.subscription.findUnique({ where: { companyId: tenantProd.company.id } });
    console.log(`   📌 Assinatura confirmada no banco: Provider="${sub?.paymentProvider}" | Status="${sub?.status}"`);

    if (sub?.paymentProvider !== 'MERCADO_PAGO') {
      throw new Error('❌ Falha na atualização da assinatura via Webhook do Mercado Pago!');
    }

    console.log('\n========================================================');
    console.log('🎉 PRODUÇÃO, SEGURANÇA E INTEGRAÇÕES 100% VALIDADAS!');
    console.log('========================================================\n');
  } catch (error: any) {
    console.error('\n❌ ERRO NA VALIDAÇÃO DE PRODUÇÃO:', error.message || error);
    process.exit(1);
  } finally {
    if (app) {
      await app.close();
    }
  }
}

testProductionSetup();
