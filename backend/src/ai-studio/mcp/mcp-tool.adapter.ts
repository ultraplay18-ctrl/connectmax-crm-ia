import { Injectable } from '@nestjs/common';
import { IAiTool } from '../domain/interfaces/ai-tool.interface';
import { IMcpTool } from '../domain/interfaces/mcp.interface';
import { McpClient } from './mcp.client';

@Injectable()
export class McpToolAdapter {
  constructor(private readonly mcpClient: McpClient) {}

  adapt(serverId: string, mcpTool: IMcpTool): IAiTool {
    return {
      name: `mcp_${mcpTool.name}`,
      slug: `mcp_${serverId}_${mcpTool.name}`,
      description: mcpTool.description || `Ferramenta MCP: ${mcpTool.name}`,
      category: 'MCP',
      parametersSchema: mcpTool.inputSchema || {},
      execute: async (params: Record<string, any>) => {
        return this.mcpClient.callTool(serverId, mcpTool.name, params);
      },
    };
  }
}
