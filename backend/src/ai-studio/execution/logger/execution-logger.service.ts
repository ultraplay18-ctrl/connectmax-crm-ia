import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { ExecutionContext } from '../interfaces/execution-context.interface';

@Injectable()
export class ExecutionLoggerService {
  private readonly logger = new Logger(ExecutionLoggerService.name);

  constructor(private readonly prisma: PrismaService) {}

  async logStep(ctx: ExecutionContext, stepName: string, message: string) {
    const logItem = {
      step: stepName,
      message,
      timestamp: new Date().toISOString(),
    };
    ctx.logs.push(logItem);
    this.logger.debug(`[${ctx.executionId}] [${stepName}] ${message}`);
  }

  async persistLogs(ctx: ExecutionContext) {
    try {
      if (ctx.agentId) {
        await this.prisma.agentLog.create({
          data: {
            companyId: ctx.companyId,
            agentId: ctx.agentId,
            level: ctx.status === 'FAILED' ? 'ERROR' : 'INFO',
            message: `Execução da Engine finalizada com status ${ctx.status}`,
            details: JSON.stringify(ctx.logs),
          },
        });
      }
    } catch (err: any) {
      this.logger.error(`Erro ao persistir logs da execução ${ctx.executionId}: ${err.message}`);
    }
  }
}
