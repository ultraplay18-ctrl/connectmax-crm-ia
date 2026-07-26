import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { McpProvider } from '../mcp/mcp.provider';
import { CreateMcpServerDto } from '../dto/create-mcp-server.dto';

@Injectable()
export class McpService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mcpProvider: McpProvider,
  ) {}

  async getConnectors() {
    return this.mcpProvider.getSupportedConnectors();
  }

  async findAll(companyId: string) {
    return this.prisma.mcpServer.findMany({
      where: { companyId },
      include: {
        tools: true,
        resources: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createServer(companyId: string, dto: CreateMcpServerDto) {
    const server = await this.prisma.mcpServer.create({
      data: {
        companyId,
        name: dto.name,
        slug: dto.slug,
        type: dto.type || 'STDIO',
        urlOrCmd: dto.urlOrCmd || null,
        status: 'CONNECTED',
        config: typeof dto.config === 'string' ? dto.config : JSON.stringify(dto.config || {}),
      },
    });

    // Registrar ferramentas simuladas padrão do MCP
    await this.prisma.mcpTool.createMany({
      data: [
        { serverId: server.id, name: `${dto.slug}_read_data`, description: `Lê dados do conector ${dto.name}` },
        { serverId: server.id, name: `${dto.slug}_sync_state`, description: `Sincroniza estado via protocolo MCP` },
      ],
    });

    return this.prisma.mcpServer.findUnique({
      where: { id: server.id },
      include: { tools: true, resources: true },
    });
  }

  async removeServer(id: string, companyId: string) {
    await this.prisma.mcpServer.deleteMany({
      where: { id, companyId },
    });
    return { message: 'Servidor MCP removido com sucesso.' };
  }
}
