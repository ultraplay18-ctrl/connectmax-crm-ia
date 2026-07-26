import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AgentExecutionsService } from '../services/agent-executions.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('ai-studio/executions')
@UseGuards(JwtAuthGuard, TenantGuard)
export class AgentExecutionsController {
  constructor(private readonly executionsService: AgentExecutionsService) {}

  @Get()
  async findAll(@CurrentUser('companyId') companyId: string, @Query('agentId') agentId?: string) {
    return this.executionsService.findAll(companyId, agentId);
  }
}
