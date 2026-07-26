import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ChatRequestDto } from './dto/chat-request.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class AiService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  // 1. Chat Assistente do Dashboard (com contexto real do tenant)
  async chatAssistant(companyId: string, userId: string, dto: ChatRequestDto) {
    // Buscar dados reais da empresa (estritamente isolados pelo companyId)
    const [company, contactsCount, leads, pendingTasks, recentInteractions] = await Promise.all([
      this.prisma.company.findUnique({ where: { id: companyId } }),
      this.prisma.contact.count({ where: { companyId } }),
      this.prisma.lead.findMany({ where: { companyId }, include: { contact: true } }),
      this.prisma.task.count({ where: { companyId, status: 'PENDING' } }),
      this.prisma.interaction.findMany({ where: { companyId }, take: 5, orderBy: { createdAt: 'desc' } }),
    ]);

    const totalPipelineValue = leads.reduce((acc, l) => acc + (l.value || 0), 0);
    const wonLeads = leads.filter((l) => l.status === 'WON');
    const totalWonValue = wonLeads.reduce((acc, l) => acc + (l.value || 0), 0);

    const stagesCount = leads.reduce((acc: any, l) => {
      acc[l.status] = (acc[l.status] || 0) + 1;
      return acc;
    }, {});

    const msgLower = dto.message.toLowerCase();
    let aiAnswer = '';

    if (msgLower.includes('resumo') || msgLower.includes('geral') || msgLower.includes('pipeline') || msgLower.includes('status')) {
      aiAnswer = `📊 **Resumo Comercial da ${company?.name || 'sua Empresa'}**:\n\n` +
        `• **Clientes Cadastrados**: ${contactsCount}\n` +
        `• **Oportunidades no Funil**: ${leads.length} negócios ativos\n` +
        `• **Valor Total em Negociação**: R$ ${totalPipelineValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n` +
        `• **Vendas Fechadas (Ganho)**: ${wonLeads.length} negócio(s) totalizando R$ ${totalWonValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n` +
        `• **Tarefas Pendentes da Equipe**: ${pendingTasks} tarefas\n\n` +
        `💡 **Recomendação da IA ConnectMax**: Foque nos negócios na etapa de **Proposta Enviada** (${stagesCount['PROPOSAL_SENT'] || 0}) e **Negociação** (${stagesCount['NEGOTIATION'] || 0}) para acelerar o fechamento deste mês!`;
    } else if (msgLower.includes('tarefa') || msgLower.includes('pendente') || msgLower.includes('vencimento')) {
      aiAnswer = `📋 **Análise de Produtividade da Equipe**:\n\n` +
        `Atualmente sua empresa possui **${pendingTasks} tarefa(s) pendente(s)**.\n` +
        `Recomendo verificar a central de tarefas para evitar que clientes fiquem mais de 48h sem retorno.`;
    } else if (msgLower.includes('lead') || msgLower.includes('oportunidade') || msgLower.includes('ganho') || msgLower.includes('perda')) {
      aiAnswer = `🎯 **Distribuição de Oportunidades por Etapa**:\n\n` +
        `• Novos Leads: ${stagesCount['NEW_LEAD'] || 0}\n` +
        `• Primeiro Contato: ${stagesCount['FIRST_CONTACT'] || 0}\n` +
        `• Qualificação: ${stagesCount['QUALIFICATION'] || 0}\n` +
        `• Proposta Enviada: ${stagesCount['PROPOSAL_SENT'] || 0}\n` +
        `• Negociação: ${stagesCount['NEGOTIATION'] || 0}\n` +
        `• Ganho 🏆: ${stagesCount['WON'] || 0}\n` +
        `• Perdido ❌: ${stagesCount['LOST'] || 0}`;
    } else {
      aiAnswer = `🤖 **ConnectMax IA Assistente Comercial**:\n\n` +
        `Analisei os dados do seu CRM em tempo real para a empresa **${company?.name}**.\n\n` +
        `Sua base possui **${contactsCount} clientes**, **${leads.length} oportunidades** (R$ ${totalPipelineValue.toLocaleString('pt-BR')}) e **${pendingTasks} tarefas pendentes**.\n\n` +
        `Como posso te ajudar no gerenciamento comercial hoje? Você pode me perguntar sobre resumo do funil, qualificação de leads ou tarefas da equipe!`;
    }

    // Salvar Insight no Banco
    await this.prisma.aiInsight.create({
      data: {
        companyId,
        userId,
        type: 'CHAT',
        prompt: dto.message,
        response: aiAnswer,
      },
    });

    return {
      message: dto.message,
      response: aiAnswer,
      createdAt: new Date(),
    };
  }

  // 2. Resumo Inteligente do Cliente
  async generateContactSummary(id: string, companyId: string, userId: string, isSuperAdmin = false) {
    const contact = await this.prisma.contact.findUnique({
      where: { id },
      include: {
        leads: true,
        tasks: { orderBy: { dueDate: 'asc' } },
        interactions: { orderBy: { createdAt: 'desc' }, take: 10 },
      },
    });

    if (!contact) {
      throw new NotFoundException('Cliente não encontrado.');
    }

    if (!isSuperAdmin && contact.companyId !== companyId) {
      throw new ForbiddenException('Acesso negado: Este cliente pertence a outra empresa.');
    }

    const totalLeadsValue = contact.leads.reduce((acc, l) => acc + (l.value || 0), 0);
    const recentCalls = contact.interactions.filter((i) => i.type === 'CALL').length;

    const summaryText = `✨ **Resumo Inteligente gerado para ${contact.name}**:\n\n` +
      `📌 **Perfil do Cliente**: ${contact.type === 'COMPANY' ? 'Pessoa Jurídica' : 'Pessoa Física'} ${
        contact.companyName ? `(${contact.companyName})` : ''
      }\n` +
      `📊 **Situação Comercial**: Possui ${contact.leads.length} oportunidade(s) associada(s) totalizando R$ ${totalLeadsValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.\n` +
      `📞 **Últimos Contatos**: Registradas ${contact.interactions.length} interação(ões) recentes (${recentCalls} chamadas telefônicas).\n` +
      `📝 **Tarefas Ativas**: ${contact.tasks.filter((t) => t.status !== 'COMPLETED').length} tarefa(s) pendente(s).\n\n` +
      `🚀 **Próximas Ações Recomendadas pela IA ConnectMax**:\n` +
      `1. Agendar reunião de alinhamento com o tomador de decisão.\n` +
      `2. Validar proposta comercial ativa e apresentar condições de fechamento.\n` +
      `3. Manter registro de todas as conversas na linha do tempo.`;

    await this.prisma.aiInsight.create({
      data: {
        companyId,
        userId,
        type: 'CONTACT_SUMMARY',
        targetId: id,
        prompt: `Gerar resumo inteligente para contato ${id}`,
        response: summaryText,
      },
    });

    await this.auditLogsService.log({
      companyId,
      userId,
      action: 'AI_SUMMARY_GENERATE',
      entity: 'Contact',
      entityId: id,
    });

    return {
      contactId: id,
      summary: summaryText,
      generatedAt: new Date(),
    };
  }

  // 3. Qualificação Automática de Lead
  async qualifyLead(id: string, companyId: string, userId: string, isSuperAdmin = false) {
    const lead = await this.prisma.lead.findUnique({
      where: { id },
      include: {
        contact: true,
        tasks: true,
        interactions: true,
      },
    });

    if (!lead) {
      throw new NotFoundException('Oportunidade não encontrada.');
    }

    if (!isSuperAdmin && lead.companyId !== companyId) {
      throw new ForbiddenException('Acesso negado: Esta oportunidade pertence a outra empresa.');
    }

    let score: 'HOT' | 'WARM' | 'COLD' = 'WARM';
    let reasoning = '';

    // Lógica de Inteligência de Classificação
    if (lead.status === 'WON') {
      score = 'HOT';
      reasoning = '🏆 Negócio já fechado com sucesso (Ganho).';
    } else if (lead.status === 'LOST') {
      score = 'COLD';
      reasoning = '❌ Negócio encerrado como perdido.';
    } else if (lead.value >= 50000 || lead.status === 'NEGOTIATION' || lead.status === 'PROPOSAL_SENT') {
      score = 'HOT';
      reasoning = `🔥 **Lead Quente**: Oportunidade com alto valor comercial (R$ ${lead.value.toLocaleString('pt-BR')}) em estágio avançado no funil (${lead.status}). Alta probabilidade de conversão rápida!`;
    } else if (lead.status === 'QUALIFICATION' || lead.status === 'FIRST_CONTACT' || lead.interactions.length > 2) {
      score = 'WARM';
      reasoning = `⚠️ **Lead Morno**: Negócio com engajamento ativo no funil e interações registradas. Recomendado enviar proposta customizada.`;
    } else {
      score = 'COLD';
      reasoning = `❄️ **Lead Frio**: Oportunidade recém-criada ou sem movimentações recentes. Recomendada qualificação e alinhamento de expectativas.`;
    }

    const updatedLead = await this.prisma.lead.update({
      where: { id },
      data: {
        aiScore: score,
        aiReasoning: reasoning,
        aiScoreDate: new Date(),
      },
      include: {
        contact: true,
        assignedUser: { select: { id: true, name: true, email: true } },
      },
    });

    await this.prisma.aiInsight.create({
      data: {
        companyId,
        userId,
        type: 'LEAD_QUALIFICATION',
        targetId: id,
        prompt: `Qualificar lead ${id}`,
        response: `${score}: ${reasoning}`,
      },
    });

    await this.auditLogsService.log({
      companyId,
      userId,
      action: 'AI_LEAD_QUALIFY',
      entity: 'Lead',
      entityId: id,
      payload: { score, reasoning },
    });

    return updatedLead;
  }
}
