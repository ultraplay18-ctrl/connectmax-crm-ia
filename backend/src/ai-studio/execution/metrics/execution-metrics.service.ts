import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { ExecutionContext } from '../interfaces/execution-context.interface';

@Injectable()
export class ExecutionMetricsService {
  private readonly logger = new Logger(ExecutionMetricsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async recordExecutionMetrics(ctx: ExecutionContext) {
    ctx.endTime = Date.now();
    ctx.latencyMs = ctx.endTime - ctx.startTime;

    // Cálculo estimado de tokens e custo
    ctx.promptTokens = Math.max(120, Math.floor(ctx.input.length / 4) + 150);
    ctx.completionTokens = Math.max(180, Math.floor((ctx.outputText?.length || 0) / 4));
    ctx.totalTokens = ctx.promptTokens + ctx.completionTokens;
    ctx.estimatedCostUsd = Number(((ctx.totalTokens / 1000) * 0.002).toFixed(6));

    try {
      if (ctx.agentId) {
        await this.prisma.agentExecution.create({
          data: {
            companyId: ctx.companyId,
            agentId: ctx.agentId,
            userId: ctx.userId || null,
            status: ctx.status,
            promptTokens: ctx.promptTokens,
            completionTokens: ctx.completionTokens,
            totalTokens: ctx.totalTokens,
            cost: ctx.estimatedCostUsd,
            executionTimeMs: ctx.latencyMs,
            provider: ctx.provider || 'OpenAI',
            modelName: ctx.modelName || 'gpt-4o',
            input: ctx.input,
            output: ctx.outputText || null,
          },
        });
      }
    } catch (err: any) {
      this.logger.error(`Erro ao gravar métricas da execução ${ctx.executionId}: ${err.message}`);
    }
  }
}
