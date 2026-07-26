import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { McpService } from '../services/mcp.service';
import { CreateMcpServerDto } from '../dto/create-mcp-server.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('ai-studio/mcp')
@UseGuards(JwtAuthGuard, TenantGuard)
export class McpController {
  constructor(private readonly mcpService: McpService) {}

  @Get('connectors')
  async getConnectors() {
    return this.mcpService.getConnectors();
  }

  @Get('servers')
  async findAll(@CurrentUser('companyId') companyId: string) {
    return this.mcpService.findAll(companyId);
  }

  @Post('servers')
  async createServer(@CurrentUser('companyId') companyId: string, @Body() dto: CreateMcpServerDto) {
    return this.mcpService.createServer(companyId, dto);
  }

  @Delete('servers/:id')
  async removeServer(@Param('id') id: string, @CurrentUser('companyId') companyId: string) {
    return this.mcpService.removeServer(id, companyId);
  }
}
