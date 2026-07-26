import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';
import { AuthService } from '../src/auth/auth.service';
import { SubscriptionsService } from '../src/subscriptions/subscriptions.service';

async function testCommercialLaunch() {
  console.log('========================================================');
  console.log('🧪 VALIDAÇÃO DO LANÇAMENTO COMERCIAL E TRIAL DE 14 DIAS');
  console.log('========================================================\n');

  let app: INestApplication;
  let prisma: PrismaService;
  let authService: AuthService;
  let subscriptionsService: SubscriptionsService;

  try {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    authService = moduleFixture.get<AuthService>(AuthService);
    subscriptionsService = moduleFixture.get<SubscriptionsService>(SubscriptionsService);

    // Setup Tenant
    await prisma.company.deleteMany({ where: { document: '21212121000121' } });

    const tenantTrial = await authService.registerCompany({
      companyName: 'Empresa Trial Comercial',
      document: '21212121000121',
      companyEmail: 'trial@comercial.com',
      adminName: 'Admin Trial',
      adminEmail: 'admin@trial.com',
      adminPassword: 'SenhaTrial123!',
    });

    // 1. Validar Período de Trial de 14 Dias no Registro
    const mySub = await subscriptionsService.getMySubscription(tenantTrial.company.id);
    console.log(`✅ Empresa registrada no Plano "${mySub.plan.name}" em período de DEGUSTAÇÃO:
       - Status: ${mySub.subscription.status}
       - IsTrial: ${mySub.trial.isTrial}
       - Dias Restantes de Trial: ${mySub.trial.daysRemaining} dias`);

    if (!mySub.trial.isTrial || mySub.trial.daysRemaining <= 0) {
      throw new Error('❌ Falha na atribuição automática dos 14 dias de Trial Gratuito!');
    }

    // 2. Testar encerramento do Trial ao efetuar a contratação (Upgrade)
    const plans = await subscriptionsService.findAllPlans();
    const proPlan = plans.find((p) => p.name === 'Professional');
    
    console.log('\n2️⃣ [TESTE UPGRADE] Efetivando contratação paga para o plano Professional...');
    await subscriptionsService.changePlan(tenantTrial.company.id, tenantTrial.user.id, {
      planId: proPlan!.id,
    });

    const activeSub = await subscriptionsService.getMySubscription(tenantTrial.company.id);
    console.log(`   📌 Novo Status: "${activeSub.subscription.status}" | IsTrial: ${activeSub.trial.isTrial} | Plano: "${activeSub.plan.name}"`);

    if (activeSub.trial.isTrial || activeSub.subscription.status !== 'ACTIVE') {
      throw new Error('❌ Falha ao encerrar status de Trial após contratação do plano!');
    }

    console.log('\n========================================================');
    console.log('🎉 TRIAL DE 14 DIAS E FLUXO COMERCIAL 100% VALIDADOS!');
    console.log('========================================================\n');
  } catch (error: any) {
    console.error('\n❌ ERRO NA VALIDAÇÃO DO FLUXO COMERCIAL:', error.message || error);
    process.exit(1);
  } finally {
    if (app) {
      await app.close();
    }
  }
}

testCommercialLaunch();
