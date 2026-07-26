import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';
import { AuthService } from '../src/auth/auth.service';
import { WhatsappService } from '../src/whatsapp/whatsapp.service';

async function testWhatsappModule() {
  console.log('========================================================');
  console.log('🧪 VALIDAÇÃO DO MÓDULO WHATSAPP + ATENDIMENTO IA (MULTI-TENANT)');
  console.log('========================================================\n');

  let app: INestApplication;
  let prisma: PrismaService;
  let authService: AuthService;
  let whatsappService: WhatsappService;

  try {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    authService = moduleFixture.get<AuthService>(AuthService);
    whatsappService = moduleFixture.get<WhatsappService>(WhatsappService);

    // Setup Tenants
    await prisma.company.deleteMany({ where: { document: { in: ['12121212000112', '13131313000113'] } } });

    const tenantWA_1 = await authService.registerCompany({
      companyName: 'WhatsApp Corp 1',
      document: '12121212000112',
      companyEmail: 'wa1@corp.com',
      adminName: 'Admin WA 1',
      adminEmail: 'admin@wa1.com',
      adminPassword: 'SenhaWA1123!',
    });

    const tenantWA_2 = await authService.registerCompany({
      companyName: 'WhatsApp Corp 2',
      document: '13131313000113',
      companyEmail: 'wa2@corp.com',
      adminName: 'Admin WA 2',
      adminEmail: 'admin@wa2.com',
      adminPassword: 'SenhaWA2123!',
    });

    // 1. Simular Mensagem do Cliente no WhatsApp da Empresa 1
    console.log('1️⃣ [TESTE WA] Simulando mensagem recebida de novo número com interesse comercial...');
    const conv1 = await whatsappService.simulateIncomingMessage(tenantWA_1.company.id, {
      phone: '11988887777',
      clientName: 'Marcelo Oliveira',
      content: 'Olá! Gostaria de um orçamento do sistema CRM para minha empresa.',
    });

    console.log(`   Conversa ID: ${conv1.id} | Telefone: ${conv1.phone} | Status: ${conv1.status}`);
    console.log(`   Intenção Identificada pela IA: [${conv1.intent}]`);
    console.log(`   Total de Mensagens no Histórico: ${conv1.messages.length}`);

    // Verificar se Lead foi capturado automaticamente
    const capturedLead = await prisma.lead.findFirst({
      where: { companyId: tenantWA_1.company.id, contactId: conv1.contactId },
    });

    if (!capturedLead || capturedLead.source !== 'WhatsApp') {
      throw new Error('❌ Falha na captura automática de Lead pelo WhatsApp!');
    }
    console.log(`   🎯 Lead capturado no Kanban: "${capturedLead.title}" (Origem: ${capturedLead.source})\n`);

    // 2. Testar Resposta Manual e Transbordo para Atendente Humano
    console.log('2️⃣ [TESTE WA] Testando transferência para atendente humano...');
    const transferred = await whatsappService.transferConversation(tenantWA_1.company.id, tenantWA_1.user.id, {
      conversationId: conv1.id,
      assignedUserId: tenantWA_1.user.id,
      status: 'HUMAN_ATTENDING',
    });

    console.log(`   Novo Status da Conversa: ${transferred.status} | Atendente: ${transferred.assignedUser?.name}`);

    // Enviar mensagem manual
    const sentMsg = await whatsappService.sendMessage(tenantWA_1.company.id, tenantWA_1.user.id, {
      conversationId: conv1.id,
      content: 'Olá Marcelo! Sou o Admin WA 1 e vou assumir seu atendimento. Qual é o segmento da sua empresa?',
    });

    console.log(`   Mensagem enviada pelo atendente humano: "${sentMsg.content}"\n`);

    // 3. Testar Isolamento Multi-tenant (Empresa 2 não enxerga conversas da Empresa 1)
    console.log('3️⃣ [TESTE WA CRÍTICO] Verificando Isolamento Multi-Tenant...');
    const conversationsTenant2 = await whatsappService.findAllConversations(tenantWA_2.company.id);

    console.log(`   Conversas retornadas para Empresa 2: ${conversationsTenant2.length}`);

    if (conversationsTenant2.length !== 0) {
      throw new Error('❌ ALERTA CRÍTICO: Empresa 2 enxergou conversas do WhatsApp da Empresa 1!');
    }

    console.log('========================================================');
    console.log('🎉 MÓDULO WHATSAPP + IA 100% VALIDADE E APROVADO!');
    console.log('========================================================\n');
  } catch (error: any) {
    console.error('\n❌ ERRO NA VALIDAÇÃO DO MÓDULO WHATSAPP:', error.message || error);
    process.exit(1);
  } finally {
    if (app) {
      await app.close();
    }
  }
}

testWhatsappModule();
