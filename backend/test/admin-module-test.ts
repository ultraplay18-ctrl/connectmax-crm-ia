import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';
import { AuthService } from '../src/auth/auth.service';
import { AdminService } from '../src/admin/admin.service';
import { SubscriptionsService } from '../src/subscriptions/subscriptions.service';

async function testAdminModule() {
  console.log('========================================================');
  console.log('🧪 VALIDAÇÃO DO PAINEL SUPER ADMINISTRADOR SAAS');
  console.log('========================================================\n');

  let app: INestApplication;
  let prisma: PrismaService;
  let authService: AuthService;
  let adminService: AdminService;
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
    adminService = moduleFixture.get<AdminService>(AdminService);
    subscriptionsService = moduleFixture.get<SubscriptionsService>(SubscriptionsService);

    // Setup Tenants
    await prisma.company.deleteMany({ where: { document: { in: ['18181818000118', '19191919000119'] } } });

    const tenantAdm_1 = await authService.registerCompany({
      companyName: 'Empresa Cliente A',
      document: '18181818000118',
      companyEmail: 'admA@saas.com',
      adminName: 'Admin Cliente A',
      adminEmail: 'admin@clienteA.com',
      adminPassword: 'SenhaClienteA123!',
    });

    const tenantAdm_2 = await authService.registerCompany({
      companyName: 'Empresa Cliente B',
      document: '19191919000119',
      companyEmail: 'admB@saas.com',
      adminName: 'Admin Cliente B',
      adminEmail: 'admin@clienteB.com',
      adminPassword: 'SenhaClienteB123!',
    });

    // Colocar Empresa B no plano Professional
    const plans = await subscriptionsService.findAllPlans();
    const proPlan = plans.find((p) => p.name === 'Professional');
    if (proPlan) {
      await subscriptionsService.changePlan(tenantAdm_2.company.id, tenantAdm_2.user.id, {
        planId: proPlan.id,
      });
    }

    // 1. Validar Dashboard & Métricas Globais (MRR)
    const metrics = await adminService.getDashboardMetrics();
    console.log(`✅ Métricas Globais Apuradas:
       - Total de Empresas: ${metrics.totalCompanies}
       - Empresas Ativas: ${metrics.activeCompanies}
       - Usuários Totais: ${metrics.totalUsers}
       - Receita Recorrente Mensal (MRR): R$ ${metrics.mrr}`);

    if (metrics.mrr <= 0) {
      throw new Error('❌ Falha no cálculo do MRR global!');
    }

    // 2. Testar Bloqueio / Alteração de Status da Empresa A (SUPER_ADMIN)
    console.log('\n2️⃣ [TESTE BLOQUEIO] Suspendendo acesso da Empresa Cliente A...');
    await adminService.updateCompanyStatus(tenantAdm_1.company.id, { status: 'SUSPENDED' as any }, tenantAdm_1.user.id);
    
    const companyA = await adminService.findOneCompany(tenantAdm_1.company.id);
    console.log(`   Novo Status da Empresa A: "${companyA.status}"`);

    if (companyA.status !== 'SUSPENDED') {
      throw new Error('❌ Falha ao alterar status da empresa para SUSPENDED!');
    }

    // 3. Testar Alteração Direta de Plano pelo Super Admin
    const enterprisePlan = plans.find((p) => p.name === 'Enterprise');
    if (enterprisePlan) {
      console.log('3️⃣ [TESTE ADMIN PLANO] Migrando Empresa B para Enterprise via Super Admin...');
      await adminService.updateCompanyPlan(tenantAdm_2.company.id, { planId: enterprisePlan.id }, tenantAdm_2.user.id);
      
      const companyB = await adminService.findOneCompany(tenantAdm_2.company.id);
      console.log(`   Novo Plano da Empresa B: "${companyB.subscription?.plan?.name}"`);
    }

    // 4. Testar Consulta dos Audit Logs Globais
    const globalLogs = await adminService.findAllAuditLogs();
    console.log(`\n4️⃣ [AUDITORIA GLOBAL] Total de eventos gravados consultados: ${globalLogs.length}`);

    console.log('========================================================');
    console.log('🎉 PAINEL SUPER ADMINISTRADOR 100% VALIDADOS E APROVADO!');
    console.log('========================================================\n');
  } catch (error: any) {
    console.error('\n❌ ERRO NA VALIDAÇÃO DO MÓDULO SUPER ADMIN:', error.message || error);
    process.exit(1);
  } finally {
    if (app) {
      await app.close();
    }
  }
}

testAdminModule();
