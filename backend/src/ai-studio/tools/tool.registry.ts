import { Injectable } from '@nestjs/common';
import { IAiTool } from '../domain/interfaces/ai-tool.interface';

@Injectable()
export class ToolRegistry {
  private tools: Map<string, IAiTool> = new Map();

  constructor() {
    this.registerNativeTools();
  }

  private registerNativeTools() {
    const nativeTools: IAiTool[] = [
      {
        name: 'CRM Tool',
        slug: 'crm',
        description: 'Gerencia contatos, leads e oportunidades comerciais no ConnectMax CRM',
        category: 'Vendas',
        parametersSchema: { action: { type: 'string', description: 'create_lead, find_contact, move_stage' } },
        execute: async (params) => ({ status: 'success', tool: 'crm', params }),
      },
      {
        name: 'Financeiro Tool',
        slug: 'financial',
        description: 'Consulta e lança recebíveis e pagáveis no financeiro',
        category: 'Financeiro',
        parametersSchema: { action: { type: 'string', description: 'get_summary, add_receivable' } },
        execute: async (params) => ({ status: 'success', tool: 'financial', params }),
      },
      {
        name: 'Agenda Tool',
        slug: 'calendar',
        description: 'Agenda reuniões e verifica disponibilidade de horários',
        category: 'Produtividade',
        parametersSchema: { date: { type: 'string', description: 'Data da reunião' } },
        execute: async (params) => ({ status: 'success', tool: 'calendar', params }),
      },
      {
        name: 'WhatsApp Tool',
        slug: 'whatsapp',
        description: 'Envia mensagens ativas e responde clientes via WhatsApp',
        category: 'Comunicação',
        parametersSchema: { phone: { type: 'string', description: 'Número do WhatsApp' }, message: { type: 'string', description: 'Texto da mensagem' } },
        execute: async (params) => ({ status: 'success', tool: 'whatsapp', params }),
      },
      {
        name: 'Email Tool',
        slug: 'email',
        description: 'Dispara e-mails transacionais e comerciais',
        category: 'Comunicação',
        parametersSchema: { to: { type: 'string', description: 'Destinatário' }, subject: { type: 'string', description: 'Assunto' } },
        execute: async (params) => ({ status: 'success', tool: 'email', params }),
      },
      {
        name: 'Webhook Tool',
        slug: 'webhook',
        description: 'Dispara requisições HTTP POST para webhooks externos',
        category: 'Integração',
        parametersSchema: { url: { type: 'string', description: 'URL do webhook' } },
        execute: async (params) => ({ status: 'success', tool: 'webhook', params }),
      },
      {
        name: 'API Tool',
        slug: 'api',
        description: 'Executa chamadas genéricas para APIs externas REST',
        category: 'Integração',
        parametersSchema: { endpoint: { type: 'string', description: 'Endpoint da API' } },
        execute: async (params) => ({ status: 'success', tool: 'api', params }),
      },
      {
        name: 'Database Tool',
        slug: 'database',
        description: 'Realiza consultas seguras na base de dados da empresa',
        category: 'Dados',
        parametersSchema: { queryName: { type: 'string', description: 'Nome da consulta' } },
        execute: async (params) => ({ status: 'success', tool: 'database', params }),
      },
    ];

    for (const tool of nativeTools) {
      this.tools.set(tool.slug, tool);
    }
  }

  getTool(slug: string): IAiTool | undefined {
    return this.tools.get(slug);
  }

  getAllTools(): IAiTool[] {
    return Array.from(this.tools.values());
  }
}
