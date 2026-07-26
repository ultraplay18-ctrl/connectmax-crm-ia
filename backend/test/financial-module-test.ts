import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';
import { AuthService } from '../src/auth/auth.service';
import { ContactsService } from '../src/contacts/contacts.service';
import { FinancialService } from '../src/financial/financial.service';

async function testFinancialModule() {
  console.log('========================================================');
  console.log('🧪 VALIDAÇÃO DO MÓDULO FINANCEIRO CRM (MULTI-TENANT)');
  console.log('========================================================\n');

  let app: INestApplication;
  let prisma: PrismaService;
  let authService: AuthService;
  let contactsService: ContactsService;
  let financialService: FinancialService;

  try {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    authService = moduleFixture.get<AuthService>(AuthService);
    contactsService = moduleFixture.get<ContactsService>(ContactsService);
    financialService = moduleFixture.get<FinancialService>(FinancialService);

    // Setup Tenants
    await prisma.company.deleteMany({ where: { document: { in: ['14141414000114', '15151515000115'] } } });

    const tenantFin_1 = await authService.registerCompany({
      companyName: 'Fintech Enterprise 1',
      document: '14141414000114',
      companyEmail: 'fin1@corp.com',
      adminName: 'Admin Fin 1',
      adminEmail: 'admin@fin1.com',
      adminPassword: 'SenhaFin1123!',
    });

    const tenantFin_2 = await authService.registerCompany({
      companyName: 'Fintech Enterprise 2',
      document: '15151515000115',
      companyEmail: 'fin2@corp.com',
      adminName: 'Admin Fin 2',
      adminEmail: 'admin@fin2.com',
      adminPassword: 'SenhaFin2123!',
    });

    // 1. Criar Cliente e Conta a Receber na Empresa 1
    const contact1 = await contactsService.create(
      tenantFin_1.company.id,
      { name: 'Grupo Alfa Tech', email: 'alfa@tech.com' },
      tenantFin_1.user.id,
    );

    const receivable1 = await financialService.createReceivable(
      tenantFin_1.company.id,
      {
        description: 'Mensalidade Licenciamento Software CRM',
        amount: 15000,
        dueDate: new Date().toISOString(),
        status: 'PAID' as any,
        paymentDate: new Date().toISOString(),
        contactId: contact1.id,
      },
      tenantFin_1.user.id,
    );
    console.log(`✅ Conta a Receber criada para Empresa 1: "R$ ${receivable1.amount}" (${receivable1.status})`);

    // 2. Criar Conta a Pagar na Empresa 1
    const payable1 = await financialService.createPayable(
      tenantFin_1.company.id,
      {
        supplier: 'AWS Cloud Services',
        category: 'Infraestrutura',
        description: 'Hospedagem de Servidores Cloud',
        amount: 3500,
        dueDate: new Date().toISOString(),
        status: 'PAID' as any,
        paymentDate: new Date().toISOString(),
      },
      tenantFin_1.user.id,
    );
    console.log(`✅ Conta a Pagar criada para Empresa 1: "R$ ${payable1.amount}" (${payable1.supplier})`);

    // 3. Testar Apuração do Fluxo de Caixa e Saldo da Empresa 1
    const summary1 = await financialService.getFinancialSummary(tenantFin_1.company.id);
    console.log(`📊 Saldo Líquido Apurado para Empresa 1: R$ ${summary1.netBalance} (Receitas Pago: R$ ${summary1.totalReceivablesPaid} - Despesas Pago: R$ ${summary1.totalPayablesPaid})`);

    if (summary1.netBalance !== 11500) {
      throw new Error(`❌ Falha no cálculo do saldo do fluxo de caixa (Esperado: R$ 11.500, Apurado: R$ ${summary1.netBalance})`);
    }

    // 4. Testar Isolamento Multi-tenant (Empresa 2 não enxerga contas da Empresa 1)
    const receivablesTenant2 = await financialService.findAllReceivables(tenantFin_2.company.id);
    const payablesTenant2 = await financialService.findAllPayables(tenantFin_2.company.id);

    console.log(`   Contas a Receber retornadas para Empresa 2: ${receivablesTenant2.length}`);
    console.log(`   Contas a Pagar retornadas para Empresa 2: ${payablesTenant2.length}`);

    if (receivablesTenant2.length !== 0 || payablesTenant2.length !== 0) {
      throw new Error('❌ ALERTA CRÍTICO: Empresa 2 enxergou dados financeiros da Empresa 1!');
    }

    console.log('========================================================');
    console.log('🎉 MÓDULO FINANCEIRO CRM 100% VALIDADOS E APROVADO!');
    console.log('========================================================\n');
  } catch (error: any) {
    console.error('\n❌ ERRO NA VALIDAÇÃO DO MÓDULO FINANCEIRO:', error.message || error);
    process.exit(1);
  } finally {
    if (app) {
      await app.close();
    }
  }
}

testFinancialModule();
