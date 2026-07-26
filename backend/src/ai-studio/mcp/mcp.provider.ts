import { Injectable } from '@nestjs/common';
import { McpRegistry } from './mcp.registry';
import { McpServerManager } from './mcp-server.manager';
import { McpToolAdapter } from './mcp-tool.adapter';

@Injectable()
export class McpProvider {
  constructor(
    public readonly registry: McpRegistry,
    public readonly manager: McpServerManager,
    public readonly adapter: McpToolAdapter,
  ) {}

  getSupportedConnectors() {
    return [
      { name: 'GitHub', slug: 'github', type: 'STDIO', description: 'Integração com repositórios e issues do GitHub via MCP' },
      { name: 'Google Drive', slug: 'google-drive', type: 'HTTP', description: 'Leitura e indexação de documentos do Google Drive' },
      { name: 'Notion', slug: 'notion', type: 'HTTP', description: 'Acesso a páginas e databases do Notion' },
      { name: 'Slack', slug: 'slack', type: 'SSE', description: 'Envio de mensagens e leitura de canais do Slack' },
      { name: 'Discord', slug: 'discord', type: 'SSE', description: 'Bot e leitura de servidores Discord' },
      { name: 'PostgreSQL', slug: 'postgresql', type: 'STDIO', description: 'Consulta direta a bancos PostgreSQL' },
      { name: 'MySQL', slug: 'mysql', type: 'STDIO', description: 'Consulta direta a bancos MySQL' },
      { name: 'API REST Genérica', slug: 'rest-api', type: 'HTTP', description: 'Conector para qualquer API REST externa' },
    ];
  }
}
