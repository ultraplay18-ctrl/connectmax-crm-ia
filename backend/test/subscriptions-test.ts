import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';
import { AuthService } from '../src/auth/auth.service';
import { UsersService } from '../src/users/users.service';
import { SubscriptionsService } from '../src/subscriptions/subscriptions.service';

async function testSubscriptionsModule() {
  console.log('========================================================');
  console.log('🧪 VALIDAÇÃO DE PLANOS, ASSINATURAS E LIMITES SAAS');
  console.log('========================================================\n');

  let app: INestApplication;
  let prisma: PrismaService;
  let authService: AuthService;
  let usersService: UsersService;
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
    usersService = moduleFixture.get<UsersService>(UsersService);
    subscriptionsService = moduleFixture.get<SubscriptionsService>(SubscriptionsService);

    // Setup Tenant
    await prisma.company.deleteMany({ where: { document: { in: ['16161616000116', '17171717000117'] } } });

    const tenantSub_1 = await authService.registerCompany({
      companyName: 'SaaS Customer 1',
      document: '16161616000116',
      companyEmail: 'sub1@saas.com',
      adminName: 'Admin Sub 1',
      adminEmail: 'admin@sub1.com',
      adminPassword: 'SenhaSub1123!',
    });

    // 1. Validar Seed dos Planos (Starter, Professional, Enterprise)
    const plans = await subscriptionsService.findAllPlans();
    console.log(`✅ Planos cadastrados na plataforma SaaS: ${plans.map((p) => p.name).join(', ')}`);

    if (plans.length < 3) {
      throw new Error('❌ Falha no seed inicial dos planos SaaS!');
    }

    // 2. Verificar Assinatura Automática no Plano Starter (Máximo 3 usuários)
    const mySub = await subscriptionsService.getMySubscription(tenantSub_1.company.id);
    console.log(`📌 Empresa ${tenantSub_1.company.name} associada ao plano: "${mySub.plan.name}" (Limite: ${mySub.plan.maxUsers} usuários)`);

    // 3. Cadastrar +2 usuários (totalizando 3 com o admin inicial)
    await usersService.create(tenantSub_1.company.id, {
      name: 'User 2',
      email: 'user2@sub1.com',
      password: 'SenhaUser2123!',
    });

    await usersService.create(tenantSub_1.company.id, {
      name: 'User 3',
      email: 'user3@sub1.com',
      password: 'SenhaUser3123!',
    });

    console.log('   ✅ 3 usuários cadastrados com sucesso no plano Starter.');

    // 4. Testar Bloqueio de Cota ao tentar criar o 4º usuário
    console.log('4️⃣ [TESTE LIMITE] Tentando cadastrar o 4º usuário no plano Starter (limite 3)...');
    let limitBlocked = false;
    try {
      await usersService.create(tenantSub_1.company.id, {
        name: 'User 4 Excedente',
        email: 'user4@sub1.com',
        password: 'SenhaUser4123!',
      });
    } catch (e: any) {
      limitBlocked = true;
      console.log(`   🛡️ Bloqueio disparado com sucesso: "${e.message}"`);
    }

    if (!limitBlocked) {
      throw new Error('❌ ALERTA CRÍTICO DE COTA: O sistema permitiu criar usuário além do limite do plano!');
    }

    // 5. Testar Upgrade de Plano (Starter -> Professional)
    const proPlan = plans.find((p) => p.name === 'Professional');
    if (!proPlan) throw new Error('Plano Professional não encontrado.');

    console.log('5️⃣ [TESTE UPGRADE] Executando Upgrade para o plano Professional...');
    await subscriptionsService.changePlan(tenantSub_1.company.id, tenantSub_1.user.id, {
      planId: proPlan.id,
    });

    const updatedSub = await subscriptionsService.getMySubscription(tenantSub_1.company.id);
    console.log(`   Novo Plano Ativo: "${updatedSub.plan.name}" (Novo Limite: ${updatedSub.plan.maxUsers} usuários)`);

    // 6. Cadastrar o 4º usuário agora no plano Professional
    const user4 = await usersService.create(tenantSub_1.company.id, {
      name: 'User 4 Liberado',
      email: 'user4@sub1.com',
      password: 'SenhaUser4123!',
    });

    console.log(`   ✅ 4º usuário cadastrado com sucesso após Upgrade: "${user4.name}"`);

    console.log('========================================================');
    console.log('🎉 MÓDULO DE PLANOS, ASSINATURAS E LIMITES 100% VALIDADOS!');
    console.log('========================================================\n');
  } catch (error: any) {
    console.error('\n❌ ERRO NA VALIDAÇÃO DE ASSINATURAS:', error.message || error);
    process.exit(1);
  } finally {
    if (app) {
      await app.close();
    }
  }
}

testSubscriptionsModule();
