import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ExecutionService } from '../services/execution.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { CurrentUser, JwtPayloadUser } from '../../../common/decorators/current-user.decorator';

@Controller('ai-studio/execution')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ExecutionController {
  constructor(private readonly executionService: ExecutionService) {}

  @Post('run')
  async runExecution(
    @CurrentUser() user: JwtPayloadUser,
    @Body('agentId') agentId?: string,
    @Body('input') input?: string,
  ) {
    return this.executionService.run({
      companyId: user.companyId,
      agentId,
      input: input || 'Mensagem de teste para AI Execution Engine',
      userId: user.userId,
    });
  }
}
