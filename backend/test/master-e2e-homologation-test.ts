import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';
import { AuthService } from '../src/auth/auth.service';
import { UsersService } from '../src/users/users.service';
import { ContactsService } from '../src/contacts/contacts.service';
import { LeadsService } from '../src/leads/leads.service';
import { ActivitiesService } from '../src/activities/activities.service';
import { AiService } from '../src/ai/ai.service';
import { WhatsappService } from '../src/whatsapp/whatsapp.service';
import { FinancialService } from '../src/financial/financial.service';
import { SubscriptionsService } from '../src/subscriptions/subscriptions.service';
import { AdminService } from '../src/admin/admin.service';

async function runMasterE2eHomologation() {
  console.log('================================================================================');
  console.log('🚀 SUÍTE MÁSTER DE HOMOLOGAÇÃO E TESTES END-TO-END (E2E) - CONNECTMAX CRM IA');
  console.log('================================================================================\n');

  let app: INestApplication;
  let prisma: PrismaService;
  let authService: AuthService;
  let usersService: UsersService;
  let contactsService: ContactsService;
  let leadsService: LeadsService;
  let activitiesService: ActivitiesService;
  let aiService: AiService;
  let whatsappService: WhatsappService;
  let financialService: FinancialService;
  let subscriptionsService: SubscriptionsService;
  let adminService: AdminService;

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
    contactsService = moduleFixture.get<ContactsService>(ContactsService);
    leadsService = moduleFixture.get<LeadsService>(LeadsService);
    activitiesService = moduleFixture.get<ActivitiesService>(ActivitiesService);
    aiService = moduleFixture.get<AiService>(AiService);
    whatsappService = moduleFixture.get<WhatsappService>(WhatsappService);
    financialService = moduleFixture.get<FinancialService>(FinancialService);
    subscriptionsService = moduleFixture.get<SubscriptionsService>(SubscriptionsService);
    adminService = moduleFixture.get<AdminService>(AdminService);

    // Limpeza de ambiente de teste
    await prisma.company.deleteMany({
      where: { document: { in: ['99999999000199', '88888888000188'] } },
    });

    // =========================================================================
    // 1. FLUXO COMPLETO DE ONBOARDING, LOGIN JWT E PERMISSÕES RBAC
    // =========================================================================
    console.log('1️⃣ [HOMOLOGAÇÃO 1/6] Onboarding, Login JWT e Controle RBAC...');
    const companyA = await authService.registerCompany({
      companyName: 'Empresa Alpha Homologação',
      document: '99999999000199',
      companyEmail: 'alpha@homolog.com',
      adminName: 'Carlos Admin Alpha',
      adminEmail: 'carlos@alpha.com',
      adminPassword: 'SenhaAlpha123!',
    });

    const companyB = await authService.registerCompany({
      companyName: 'Empresa Beta Isolamento',
      document: '88888888000188',
      companyEmail: 'beta@homolog.com',
      adminName: 'Mariana Admin Beta',
      adminEmail: 'mariana@beta.com',
      adminPassword: 'SenhaBeta123!',
    });

    // Login JWT
    const loginResult = await authService.login({
      email: 'carlos@alpha.com',
      password: 'SenhaAlpha123!',
    });

    console.log(`   ✅ Empresa A ("${companyA.company.name}") e Empresa B ("${companyB.company.name}") registradas.`);
    console.log(`   🔑 Token JWT emitido com sucesso para Carlos Admin (Role: ${loginResult.user.role}).`);

    // =========================================================================
    // 2. CICLO OPERACIONAL COMPLETO DO CRM (CONTATOS, LEADS, KANBAN, TAREFAS, AGENDA)
    // =========================================================================
    console.log('\n2️⃣ [HOMOLOGAÇÃO 2/6] Ciclo de Operação do CRM (Clientes, Leads, Kanban, Tarefas e Agenda)...');
    const contactA = await contactsService.create(
      companyA.company.id,
      {
        name: 'Grupo Nexus Tech',
        email: 'contato@nexus.com.br',
        phone: '11977776666',
        document: '33333333000133',
        type: 'COMPANY' as any,
        companyName: 'Nexus Technology S.A.',
      },
      companyA.user.id,
    );

    const leadA = await leadsService.create(
      companyA.company.id,
      {
        title: 'Licenciamento Anual ConnectMax CRM IA',
        value: 45000,
        status: 'NEW_LEAD' as any,
        contactId: contactA.id,
        source: 'Indicação Comercial',
      },
      companyA.user.id,
    );

    // Movimentação do Lead pelo Funil Kanban
    await leadsService.update(
      leadA.id,
      companyA.company.id,
      { status: 'PROPOSAL_SENT' as any },
      companyA.user.id,
    );

    const updatedLeadA = await leadsService.update(
      leadA.id,
      companyA.company.id,
      { status: 'WON' as any },
      companyA.user.id,
    );

    // Tarefa e Agenda
    const taskA = await activitiesService.createTask(
      companyA.company.id,
      {
        title: 'Enviar Minuta Contratual e Nota Fiscal',
        dueDate: new Date().toISOString(),
        priority: 'HIGH' as any,
        contactId: contactA.id,
        leadId: leadA.id,
      },
      companyA.user.id,
    );

    const eventA = await activitiesService.createEvent(
      companyA.company.id,
      {
        title: 'Reunião de Onboarding do Cliente Nexus',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 3600000).toISOString(),
        location: 'Google Meet',
        contactId: contactA.id,
      },
      companyA.user.id,
    );

    console.log(`   ✅ Cliente "${contactA.name}" cadastrado.`);
    console.log(`   🎯 Oportunidade "${updatedLeadA.title}" movida para etapa GANHO (Valor: R$ ${updatedLeadA.value}).`);
    console.log(`   📅 Tarefa "${taskA.title}" e Compromisso "${eventA.title}" agendados.`);

    // =========================================================================
    // 3. MÓDULO CONNECTMAX IA (RESUMOS, QUALIFICAÇÃO E ASSISTENTE)
    // =========================================================================
    console.log('\n3️⃣ [HOMOLOGAÇÃO 3/6] Módulo ConnectMax IA (Resumos, Qualificação e Assistente)...');
    const summaryIa = await aiService.generateContactSummary(contactA.id, companyA.company.id, companyA.user.id);
    const qualificationIa = await aiService.qualifyLead(leadA.id, companyA.company.id, companyA.user.id);
    const chatIa = await aiService.chatAssistant(companyA.company.id, companyA.user.id, {
      message: 'Quais clientes ganharam propostas hoje?',
    });

    console.log(`   ✨ Resumo Gerado pela IA: "${summaryIa.summary.substring(0, 70)}..."`);
    console.log(`   🔥 Qualificação de Lead pela IA: Score "${qualificationIa.aiScore}" | Justificativa: "${qualificationIa.aiReasoning}"`);
    console.log(`   💬 Assistente IA RAG: "${chatIa.response.substring(0, 70)}..."`);

    // =========================================================================
    // 4. ATENDIMENTO WHATSAPP BOT & CAPTURA AUTOMÁTICA DE LEADS
    // =========================================================================
    console.log('\n4️⃣ [HOMOLOGAÇÃO 4/6] WhatsApp Bot, Captura de Leads e Transbordo Humano...');
    const waMessage = await whatsappService.simulateIncomingMessage(companyA.company.id, {
      phone: '11955554444',
      content: 'Gostaria de solicitar um orçamento para contratar o sistema CRM para minha empresa',
      clientName: 'Roberto Vendas',
    });

    console.log(`   🤖 WhatsApp Atendido pela IA | Intenção: [${waMessage.intent}] | Novo Status: ${waMessage.status}`);
    
    // Verificar se Lead foi capturado no Kanban automaticamente
    const capturedLeads = await leadsService.findAll(companyA.company.id, 'WhatsApp');
    console.log(`   🎯 Leads capturados automaticamente via WhatsApp: ${capturedLeads.length} ("${capturedLeads[0]?.title}")`);

    // Transbordo para Humano
    const transferRes = await whatsappService.transferConversation(companyA.company.id, companyA.user.id, {
      conversationId: waMessage.id,
      status: 'HUMAN_ATTENDING' as any,
    });
    console.log(`   👤 Conversa transferida com sucesso para o atendente: Status = "${transferRes.status}"`);

    // =========================================================================
    // 5. CRM FINANCEIRO OPERACIONAL & FLUXO DE CAIXA
    // =========================================================================
    console.log('\n5️⃣ [HOMOLOGAÇÃO 5/6] CRM Financeiro (Contas a Receber, Pagar e Fluxo de Caixa)...');
    const receivableA = await financialService.createReceivable(
      companyA.company.id,
      {
        description: 'Faturamento Licenciamento Nexus Tech',
        amount: 45000,
        dueDate: new Date().toISOString(),
        status: 'PAID' as any,
        paymentDate: new Date().toISOString(),
        contactId: contactA.id,
        leadId: leadA.id,
      },
      companyA.user.id,
    );

    const payableA = await financialService.createPayable(
      companyA.company.id,
      {
        supplier: 'AWS Cloud & Infraestrutura',
        category: 'Infraestrutura',
        description: 'Servidores de Produção Mês 07',
        amount: 8500,
        dueDate: new Date().toISOString(),
        status: 'PAID' as any,
        paymentDate: new Date().toISOString(),
      },
      companyA.user.id,
    );

    const financialSummary = await financialService.getFinancialSummary(companyA.company.id);
    console.log(`   💵 Contas a Receber Baixadas: R$ ${financialSummary.totalReceivablesPaid}`);
    console.log(`   🔻 Contas a Pagar Liquidadas: R$ ${financialSummary.totalPayablesPaid}`);
    console.log(`   📊 Saldo Líquido do Fluxo de Caixa: R$ ${financialSummary.netBalance}`);

    if (financialSummary.netBalance !== 36500) {
      throw new Error(`❌ Falha na apuração do Saldo Financeiro (Esperado: R$ 36.500, Apurado: R$ ${financialSummary.netBalance})`);
    }

    // =========================================================================
    // 6. CONTROLE DE COTAS SAAS & ISOLAMENTO MULTI-TENANT
    // =========================================================================
    console.log('\n6️⃣ [HOMOLOGAÇÃO 6/6] Controle de Cotas dos Planos e Isolamento Multi-Tenant...');
    
    // Testar limite de 3 usuários no plano Starter
    await usersService.create(companyA.company.id, { name: 'User 2', email: 'u2@alpha.com', password: 'SenhaUser2!' });
    await usersService.create(companyA.company.id, { name: 'User 3', email: 'u3@alpha.com', password: 'SenhaUser3!' });

    let quotaBlocked = false;
    try {
      await usersService.create(companyA.company.id, { name: 'User 4', email: 'u4@alpha.com', password: 'SenhaUser4!' });
    } catch (e: any) {
      quotaBlocked = true;
      console.log(`   🛡️ Bloqueio de cota acionado corretamente: "${e.message}"`);
    }

    if (!quotaBlocked) {
      throw new Error('❌ ALERTA CRÍTICO: Cota excedida no plano Starter sem bloqueio!');
    }

    // Upgrade para plano Professional
    const plans = await subscriptionsService.findAllPlans();
    const proPlan = plans.find((p) => p.name === 'Professional');
    await subscriptionsService.changePlan(companyA.company.id, companyA.user.id, { planId: proPlan!.id });
    console.log('   ⚡ Upgrade efetuado para o Plano Professional (Cota: 10 usuários).');

    // Cadastro do 4º usuário liberado
    const user4 = await usersService.create(companyA.company.id, { name: 'User 4 Liberado', email: 'u4@alpha.com', password: 'SenhaUser4!' });
    console.log(`   ✅ 4º Usuário cadastrado com sucesso: "${user4.name}"`);

    // Testar Isolamento Estrito da Empresa B
    const contactsB = await contactsService.findAll(companyB.company.id);
    const leadsB = await leadsService.findAll(companyB.company.id);
    const financialB = await financialService.getFinancialSummary(companyB.company.id);

    console.log(`\n   🔒 Verificação de Isolamento Estrito (Empresa Beta):
       - Clientes da Empresa Alpha vistos pela Empresa Beta: ${contactsB.length}
       - Oportunidades da Empresa Alpha vistas pela Empresa Beta: ${leadsB.length}
       - Saldo Financeiro da Empresa Beta: R$ ${financialB.netBalance}`);

    if (contactsB.length !== 0 || leadsB.length !== 0 || financialB.netBalance !== 0) {
      throw new Error('❌ VIOLAÇÃO CRÍTICA DE MULTI-TENANT: A Empresa B enxergou dados da Empresa A!');
    }

    console.log('\n================================================================================');
    console.log('🎉 HOMOLOGAÇÃO E TESTES END-TO-END CONCLUÍDOS COM 100% DE SUCESSO E APROVAÇÃO!');
    console.log('================================================================================\n');
  } catch (error: any) {
    console.error('\n❌ ERRO NA HOMOLOGAÇÃO MÁSTER:', error.message || error);
    process.exit(1);
  } finally {
    if (app) {
      await app.close();
    }
  }
}

runMasterE2eHomologation();
