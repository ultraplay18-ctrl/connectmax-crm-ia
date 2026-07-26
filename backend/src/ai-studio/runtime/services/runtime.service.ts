import { Injectable } from '@nestjs/common';
import { RuntimeExecutor } from '../executor/runtime-executor';
import { RuntimeRequestDto } from '../dto/runtime-request.dto';
import { RuntimeResponseDto } from '../dto/runtime-response.dto';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class RuntimeService {
  constructor(
    private readonly executor: RuntimeExecutor,
    private readonly prisma: PrismaService,
  ) {}

  public async executeAgent(companyId: string, dto: RuntimeRequestDto, userId?: string): Promise<RuntimeResponseDto> {
    return this.executor.run(companyId, dto, userId);
  }

  public async getMetrics(companyId: string) {
    const executions = await this.prisma.agentExecution.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    const totalExecutions = executions.length;
    const totalTokens = executions.reduce((acc, curr) => acc + curr.totalTokens, 0);
    const totalCost = executions.reduce((acc, curr) => acc + curr.cost, 0);
    const avgLatencyMs =
      totalExecutions > 0
        ? Math.round(executions.reduce((acc, curr) => acc + curr.executionTimeMs, 0) / totalExecutions)
        : 0;

    return {
      totalExecutions,
      totalTokens,
      totalCostUsd: Number(totalCost.toFixed(4)),
      avgLatencyMs,
      recentExecutions: executions.slice(0, 10),
    };
  }
}
