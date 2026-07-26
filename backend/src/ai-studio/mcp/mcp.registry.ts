import { Injectable } from '@nestjs/common';
import { IMcpServerConfig } from '../domain/interfaces/mcp.interface';

@Injectable()
export class McpRegistry {
  private activeServers: Map<string, IMcpServerConfig> = new Map();

  registerServer(server: IMcpServerConfig) {
    this.activeServers.set(server.slug, server);
  }

  getServer(slug: string): IMcpServerConfig | undefined {
    return this.activeServers.get(slug);
  }

  listActiveServers(): IMcpServerConfig[] {
    return Array.from(this.activeServers.values());
  }

  removeServer(slug: string) {
    this.activeServers.delete(slug);
  }
}
