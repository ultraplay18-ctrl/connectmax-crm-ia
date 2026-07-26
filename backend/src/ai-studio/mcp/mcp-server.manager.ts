import { Injectable, Logger } from '@nestjs/common';
import { McpClient } from './mcp.client';
import { McpRegistry } from './mcp.registry';
import { IMcpServerConfig } from '../domain/interfaces/mcp.interface';

@Injectable()
export class McpServerManager {
  private readonly logger = new Logger(McpServerManager.name);

  constructor(
    private readonly mcpClient: McpClient,
    private readonly mcpRegistry: McpRegistry,
  ) {}

  async initializeServer(config: IMcpServerConfig): Promise<boolean> {
    this.logger.log(`[MCP Server Manager] Inicializando servidor: ${config.name} (${config.slug})`);
    const success = await this.mcpClient.connect(config.urlOrCmd || '', config.type);
    
    if (success) {
      config.status = 'CONNECTED';
      this.mcpRegistry.registerServer(config);
    } else {
      config.status = 'ERROR';
    }

    return success;
  }

  async testConnection(urlOrCmd: string, type: 'STDIO' | 'SSE' | 'HTTP'): Promise<boolean> {
    return this.mcpClient.connect(urlOrCmd, type);
  }
}
