import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';
import { AuthService } from '../src/auth/auth.service';
import { ContactsService } from '../src/contacts/contacts.service';
import { LeadsService } from '../src/leads/leads.service';
import { AiService } from '../src/ai/ai.service';

async function testAiModule() {
  console.log('========================================================');
  console.log('🧪 VALIDAÇÃO DO MÓDULO CONNECTMAX IA (MULTI-TENANT)');
  console.log('========================================================\n');

  let app: INestApplication;
  let prisma: PrismaService;
  let authService: AuthService;
  let contactsService: ContactsService;
  let leadsService: LeadsService;
  let aiService: AiService;

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
    leadsService = moduleFixture.get<LeadsService>(LeadsService);
    aiService = moduleFixture.get<AiService>(AiService);

    // Setup Tenants
    await prisma.company.deleteMany({ where: { document: { in: ['99999999000199', '10101010000100'] } } });

    const tenantAI_A = await authService.registerCompany({
      companyName: 'AI Enterprise A',
      document: '99999999000199',
      companyEmail: 'ia@enterprisea.com',
      adminName: 'Admin AI A',
      adminEmail: 'admin@aia.com',
      adminPassword: 'SenhaAIA123!',
    });

    const tenantAI_B = await authService.registerCompany({
      companyName: 'AI Enterprise B',
      document: '10101010000100',
      companyEmail: 'ia@enterpriseb.com',
      adminName: 'Admin AI B',
      adminEmail: 'admin@aib.com',
      adminPassword: 'SenhaAIB123!',
    });

    // 1. Criar Dados na Empresa A
    const contactA = await contactsService.create(
      tenantAI_A.company.id,
      {
        name: 'Roberto Viana',
        email: 'roberto@empresa.com',
        phone: '(11) 9988-7766',
        companyName: 'Viana Logística',
      },
      tenantAI_A.user.id,
    );

    const leadA = await leadsService.create(
      tenantAI_A.company.id,
      {
        title: 'Contrato Anual Logística SaaS',
        value: 120000,
        status: 'NEGOTIATION' as any,
        contactId: contactA.id,
      },
      tenantAI_A.user.id,
    );

    // 2. Criar Dados na Empresa B
    const contactB = await contactsService.create(
      tenantAI_B.company.id,
      {
        name: 'Fernanda Lima',
        email: 'fernanda@tech.com',
      },
      tenantAI_B.user.id,
    );

    // 3. Testar Chat Assistente (Com contexto da Empresa A)
    console.log('1️⃣ [TESTE IA] Testando Chat Assistente no Dashboard...');
    const chatResult = await aiService.chatAssistant(tenantAI_A.company.id, tenantAI_A.user.id, {
      message: 'Qual é o resumo do meu pipeline de vendas hoje?',
    });

    console.log('   Resposta gerada pela IA ConnectMax:');
    console.log(`   "${chatResult.response.substring(0, 180)}..."`);

    if (!chatResult.response.includes('AI Enterprise A') || !chatResult.response.includes('120')) {
      throw new Error('❌ Falha na geração da resposta do assistente!');
    }
    console.log('   ✅ Chat Assistente validado com sucesso.\n');

    // 4. Testar Resumo Inteligente do Cliente
    console.log('2️⃣ [TESTE IA] Testando Gerador de Resumo do Cliente...');
    const summaryResult = await aiService.generateContactSummary(contactA.id, tenantAI_A.company.id, tenantAI_A.user.id);

    console.log(`   Resumo gerado para ${contactA.name}:`);
    console.log(`   "${summaryResult.summary.substring(0, 180)}..."`);
    console.log('   ✅ Resumo do Cliente gerado e salvo com sucesso.\n');

    // 5. Testar Qualificação Automática de Leads (Lead Quente 🔥)
    console.log('3️⃣ [TESTE IA] Testando Qualificação Automática de Lead...');
    const qualifiedLead = await aiService.qualifyLead(leadA.id, tenantAI_A.company.id, tenantAI_A.user.id);

    console.log(`   Lead Qualificado: "${qualifiedLead.title}"`);
    console.log(`   Classificação da IA: [${qualifiedLead.aiScore}] - ${qualifiedLead.aiReasoning}`);

    if (qualifiedLead.aiScore !== 'HOT') {
      throw new Error('❌ Falha na qualificação de lead (esperado HOT devido ao valor R$ 120.000 e etapa NEGOTIATION).');
    }
    console.log('   ✅ Qualificação automática de Lead validada com sucesso.\n');

    // 6. Testar Isolamento Multi-Tenant da IA (Empresa B tentando qualificar Lead da Empresa A)
    console.log('4️⃣ [TESTE IA CRÍTICO] Verificando Isolamento Multi-Tenant da IA...');
    let aiViolationBlocked = false;
    try {
      await aiService.qualifyLead(leadA.id, tenantAI_B.company.id, tenantAI_B.user.id);
    } catch (e: any) {
      aiViolationBlocked = true;
      console.log(`   🛡️ Bloqueio disparado ao tentar usar IA em recurso cruzado: "${e.message}"`);
    }

    if (!aiViolationBlocked) {
      throw new Error('❌ ALERTA CRÍTICO DE SEGURANÇA: Empresa B usou a IA para qualificar Lead da Empresa A!');
    }

    console.log('========================================================');
    console.log('🎉 MÓDULO CONNECTMAX IA 100% VALIDAÇÕES CONCLUÍDAS!');
    console.log('========================================================\n');
  } catch (error: any) {
    console.error('\n❌ ERRO NA VALIDAÇÃO DO MÓDULO IA:', error.message || error);
    process.exit(1);
  } finally {
    if (app) {
      await app.close();
    }
  }
}

testAiModule();
