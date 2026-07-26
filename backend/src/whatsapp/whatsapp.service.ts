import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { SimulateIncomingDto } from './dto/simulate-incoming.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { TransferConversationDto } from './dto/transfer-conversation.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class WhatsappService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  // 1. Simulação de Entrada de Mensagem do WhatsApp
  async simulateIncomingMessage(companyId: string, dto: SimulateIncomingDto) {
    const cleanPhone = dto.phone.replace(/\D/g, '');

    // 1.1 Localizar ou criar o Contato/Cliente
    let contact = await this.prisma.contact.findFirst({
      where: { companyId, phone: cleanPhone },
    });

    if (!contact) {
      contact = await this.prisma.contact.create({
        data: {
          companyId,
          name: dto.clientName || `WhatsApp ${cleanPhone.slice(-4)}`,
          phone: cleanPhone,
          status: 'LEAD',
          type: 'INDIVIDUAL',
        },
      });
    }

    // 1.2 Localizar ou criar a Conversa
    let conversation = await this.prisma.conversation.findFirst({
      where: { companyId, phone: cleanPhone },
    });

    if (!conversation) {
      conversation = await this.prisma.conversation.create({
        data: {
          companyId,
          contactId: contact.id,
          phone: cleanPhone,
          status: 'AI_ATTENDING',
        },
      });
    }

    // 1.3 Análise de Intenção e Captura Automática de Lead
    const contentLower = dto.content.toLowerCase();
    let intent = 'INFO';
    let leadCaptured = null;

    const isCommercialInterest =
      contentLower.includes('orçamento') ||
      contentLower.includes('contratar') ||
      contentLower.includes('preço') ||
      contentLower.includes('comprar') ||
      contentLower.includes('plano') ||
      contentLower.includes('interesse') ||
      contentLower.includes('demo');

    if (isCommercialInterest) {
      intent = 'LEAD_INTEREST';

      // Verificar se já existe um lead ativo para este contato
      const existingLead = await this.prisma.lead.findFirst({
        where: { companyId, contactId: contact.id },
      });

      if (!existingLead) {
        leadCaptured = await this.prisma.lead.create({
          data: {
            companyId,
            contactId: contact.id,
            title: `Oportunidade WhatsApp - ${contact.name}`,
            source: 'WhatsApp',
            status: 'NEW_LEAD',
            value: 0,
            notes: `Capturado automaticamente pela IA do WhatsApp. Mensagem inicial: "${dto.content}"`,
          },
        });

        await this.auditLogsService.log({
          companyId,
          action: 'WHATSAPP_LEAD_AUTO_CAPTURE',
          entity: 'Lead',
          entityId: leadCaptured.id,
          payload: { phone: cleanPhone, message: dto.content },
        });
      }
    }

    // 1.4 Gerar Sugestão de Resposta da IA
    let aiResponseText = '';
    let suggestedReply = '';

    if (intent === 'LEAD_INTEREST') {
      aiResponseText = `Olá ${contact.name}! Sou a IA do ConnectMax CRM. Que excelente interesse! Já criei um atendimento para nossa equipe te apresentar nossos planos e condições comerciais. Qual seria o melhor horário para conversarmos?`;
      suggestedReply = `Perfeito! Nossos consultores especialistas estão prontos para te apresentar a proposta comercial. Podemos agendar uma demonstração rápida hoje?`;
    } else {
      aiResponseText = `Olá ${contact.name}! Como posso te ajudar hoje? Posso te fornecer informações sobre nossos serviços, suporte técnico ou conectar você com um atendente humano.`;
      suggestedReply = `Estou à disposição para tirar qualquer dúvida sobre nossos serviços e soluções comerciais!`;
    }

    // 1.5 Gravar Mensagem do Cliente
    await this.prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderType: 'CLIENT',
        senderName: contact.name,
        content: dto.content,
        suggestedReply,
      },
    });

    // 1.6 Se a conversa estiver sob atendimento por IA, gravar resposta da IA
    if (conversation.status === 'AI_ATTENDING') {
      await this.prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderType: 'AI',
          senderName: 'ConnectMax IA Bot',
          content: aiResponseText,
        },
      });
    }

    // 1.7 Atualizar conversa
    await this.prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        intent,
        lastMessageAt: new Date(),
      },
    });

    // 1.8 Registrar histórico de interação CRM
    await this.prisma.interaction.create({
      data: {
        companyId,
        contactId: contact.id,
        userId: conversation.assignedUserId || null,
        type: 'MESSAGE',
        title: `Mensagem recebida do WhatsApp (${cleanPhone})`,
        description: dto.content,
      },
    });

    return this.findOneConversation(conversation.id, companyId);
  }

  // 2. Envio de Mensagem por Atendente Humano
  async sendMessage(companyId: string, actorUserId: string, dto: SendMessageDto) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: dto.conversationId },
    });

    if (!conversation) throw new NotFoundException('Conversa não encontrada.');
    if (conversation.companyId !== companyId) {
      throw new ForbiddenException('Acesso negado: Conversa de outra empresa.');
    }

    const user = await this.prisma.user.findUnique({ where: { id: actorUserId } });

    const message = await this.prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderType: 'HUMAN',
        senderName: user?.name || 'Atendente',
        content: dto.content,
      },
    });

    // Atualizar status para HUMAN_ATTENDING se ainda estivesse em IA
    await this.prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        status: 'HUMAN_ATTENDING',
        assignedUserId: actorUserId,
        lastMessageAt: new Date(),
      },
    });

    return message;
  }

  // 3. Transferência / Transbordo para Atendente Humano
  async transferConversation(companyId: string, actorUserId: string, dto: TransferConversationDto) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: dto.conversationId },
    });

    if (!conversation) throw new NotFoundException('Conversa não encontrada.');
    if (conversation.companyId !== companyId) {
      throw new ForbiddenException('Acesso negado: Conversa de outra empresa.');
    }

    const updated = await this.prisma.conversation.update({
      where: { id: dto.conversationId },
      data: {
        status: (dto.status as any) || 'HUMAN_ATTENDING',
        assignedUserId: dto.assignedUserId || actorUserId,
      },
      include: {
        contact: true,
        assignedUser: { select: { id: true, name: true, email: true } },
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });

    await this.auditLogsService.log({
      companyId,
      userId: actorUserId,
      action: 'WHATSAPP_CONVERSATION_TRANSFER',
      entity: 'Conversation',
      entityId: conversation.id,
      payload: { status: updated.status, assignedUserId: updated.assignedUserId },
    });

    return updated;
  }

  // 4. Listar todas as conversas da empresa
  async findAllConversations(companyId: string, status?: string) {
    const where: any = { companyId };
    if (status) where.status = status;

    return this.prisma.conversation.findMany({
      where,
      include: {
        contact: {
          include: {
            leads: true,
          },
        },
        assignedUser: { select: { id: true, name: true, email: true } },
        messages: { orderBy: { createdAt: 'asc' } },
      },
      orderBy: { lastMessageAt: 'desc' },
    });
  }

  // 5. Buscar conversa individual
  async findOneConversation(id: string, companyId: string, isSuperAdmin = false) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id },
      include: {
        contact: {
          include: {
            leads: true,
          },
        },
        assignedUser: { select: { id: true, name: true, email: true } },
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!conversation) throw new NotFoundException('Conversa não encontrada.');
    if (!isSuperAdmin && conversation.companyId !== companyId) {
      throw new ForbiddenException('Acesso negado: Conversa pertence a outra empresa.');
    }

    return conversation;
  }
}
