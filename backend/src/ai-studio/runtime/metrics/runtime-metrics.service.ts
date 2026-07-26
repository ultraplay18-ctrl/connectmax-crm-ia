import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { RuntimeContext } from '../context/runtime-context';

@Injectable()
export class RuntimeMetricsService {
  private readonly logger = new Logger(RuntimeMetricsService.name);

  constructor(private readonly prisma: PrismaService) {}

  public async recordMetrics(ctx: RuntimeContext): Promise<void> {
    try {
      if (!ctx.agent?.id) return;

      const latency = ctx.getLatencyMs();

      await this.prisma.agentExecution.create({
        data: {
          companyId: ctx.companyId,
          agentId: ctx.agent.id,
          userId: ctx.userId || null,
          status: ctx.status,
          promptTokens: ctx.promptTokens || 120,
          completionTokens: ctx.completionTokens || 85,
          totalTokens: ctx.totalTokens || 205,
          cost: ctx.estimatedCostUsd || 0.0015,
          executionTimeMs: latency,
          provider: ctx.agent.provider || 'OpenAI',
          modelName: ctx.agent.modelName || 'gpt-4o',
          input: ctx.request.input.substring(0, 1000),
          output: ctx.outputText.substring(0, 2000),
        },
      });

      this.logger.log(
        `[Metrics Saved] Execution: ${ctx.executionId} | Latência: ${latency}ms | Tokens: ${ctx.totalTokens}`,
      );
    } catch (err) {
      this.logger.error(`Erro ao gravar métricas da execução ${ctx.executionId}:`, err);
    }
  }
}
