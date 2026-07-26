import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';
import { AuthService } from '../src/auth/auth.service';
import { LeadsService } from '../src/leads/leads.service';

async function testLeadsModule() {
  console.log('========================================================');
  console.log('🧪 VALIDAÇÃO DO MÓDULO DE LEADS E KANBAN (MULTI-TENANT)');
  console.log('========================================================\n');

  let app: INestApplication;
  let prisma: PrismaService;
  let authService: AuthService;
  let leadsService: LeadsService;

  try {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    authService = moduleFixture.get<AuthService>(AuthService);
    leadsService = moduleFixture.get<LeadsService>(LeadsService);

    // 1. Setup Empresa X e Empresa Y
    await prisma.company.deleteMany({ where: { document: { in: ['55555555000155', '66666666000166'] } } });

    const tenantX = await authService.registerCompany({
      companyName: 'Tech Lead Corp X',
      document: '55555555000155',
      companyEmail: 'contato@leadx.com',
      adminName: 'Admin Lead X',
      adminEmail: 'admin@leadx.com',
      adminPassword: 'SenhaLeadX123!',
    });

    const tenantY = await authService.registerCompany({
      companyName: 'Inova Sales Y',
      document: '66666666000166',
      companyEmail: 'contato@salesy.com',
      adminName: 'Admin Sales Y',
      adminEmail: 'admin@salesy.com',
      adminPassword: 'SenhaSalesY123!',
    });

    // 2. Criar Oportunidade para Empresa X
    const leadX = await leadsService.create(
      tenantX.company.id,
      {
        title: 'Projeto Software Enterprise X',
        source: 'Website',
        value: 75000,
        status: 'NEW_LEAD' as any,
        notes: 'Cliente interessado em contrato anual.',
      },
      tenantX.user.id,
    );

    console.log(`✅ Lead criado para Empresa X: "${leadX.title}" - Valor: R$ ${leadX.value} (Etapa: ${leadX.status})`);

    // 3. Criar Oportunidade para Empresa Y
    const leadY = await leadsService.create(
      tenantY.company.id,
      {
        title: 'Consultoria SaaS Y',
        source: 'Indicação',
        value: 30000,
        status: 'QUALIFICATION' as any,
      },
      tenantY.user.id,
    );

    console.log(`✅ Lead criado para Empresa Y: "${leadY.title}" - Valor: R$ ${leadY.value} (Etapa: ${leadY.status})`);

    // 4. Testar Transição de Etapa no Kanban (NEW_LEAD -> PROPOSAL_SENT -> WON)
    const updatedLeadX = await leadsService.updateStatus(
      leadX.id,
      tenantX.company.id,
      { status: 'PROPOSAL_SENT' as any },
      tenantX.user.id,
    );

    console.log(`✅ Transição de Etapa realizada: Novo Status = ${updatedLeadX.status}`);

    if (updatedLeadX.status !== 'PROPOSAL_SENT') {
      throw new Error('❌ Falha na transição de etapa do Lead!');
    }

    // 5. Testar Isolamento Multi-Tenant (Empresa Y tentando alterar status do Lead da Empresa X)
    let violationBlocked = false;
    try {
      await leadsService.updateStatus(
        leadX.id,
        tenantY.company.id, // Tenant Y tentando alterar Lead da Empresa X
        { status: 'WON' as any },
        tenantY.user.id,
      );
    } catch (e: any) {
      violationBlocked = true;
      console.log(`   🛡️ Bloqueio disparado ao tentar mover lead cruzado: "${e.message}"`);
    }

    if (!violationBlocked) {
      throw new Error('❌ ALERTA CRÍTICO: Empresa Y conseguiu alterar a oportunidade da Empresa X!');
    }

    console.log('========================================================');
    console.log('🎉 MÓDULO DE LEADS E KANBAN 100% VALIDADOS!');
    console.log('========================================================\n');
  } catch (error: any) {
    console.error('\n❌ ERRO NA VALIDAÇÃO DO MÓDULO DE LEADS:', error.message || error);
    process.exit(1);
  } finally {
    if (app) {
      await app.close();
    }
  }
}

testLeadsModule();
