import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AgentLogsService } from '../services/agent-logs.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('ai-studio/logs')
@UseGuards(JwtAuthGuard, TenantGuard)
export class AgentLogsController {
  constructor(private readonly logsService: AgentLogsService) {}

  @Get()
  async findAll(
    @CurrentUser('companyId') companyId: string,
    @Query('level') level?: string,
    @Query('agentId') agentId?: string,
  ) {
    return this.logsService.findAll(companyId, level, agentId);
  }
}
