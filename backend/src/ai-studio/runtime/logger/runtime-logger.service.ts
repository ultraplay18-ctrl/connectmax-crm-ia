import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { RuntimeContext } from '../context/runtime-context';

@Injectable()
export class RuntimeLoggerService {
  private readonly logger = new Logger(RuntimeLoggerService.name);

  constructor(private readonly prisma: PrismaService) {}

  public async logExecution(ctx: RuntimeContext): Promise<void> {
    try {
      if (!ctx.agent?.id) return;

      const logContent = JSON.stringify({
        input: ctx.request.input,
        output: ctx.outputText,
        stages: ctx.logs,
        tools: ctx.toolsExecuted,
        knowledge: ctx.knowledgeLoaded,
        memory: ctx.memoryLoaded,
        metrics: {
          latencyMs: ctx.getLatencyMs(),
          tokens: ctx.totalTokens,
          costUsd: ctx.estimatedCostUsd,
        },
      });

      await this.prisma.agentLog.create({
        data: {
          companyId: ctx.companyId,
          agentId: ctx.agent.id as string,
          level: ctx.status === 'FAILED' ? 'ERROR' : 'INFO',
          message: `Execução ${ctx.executionId} finalizada com status ${ctx.status}`,
          details: logContent,
        },
      });

      this.logger.log(`[Log Saved] Execution: ${ctx.executionId} | AgentLog criado.`);
    } catch (err) {
      this.logger.error(`Erro ao gravar log da execução ${ctx.executionId}:`, err);
    }
  }
}
