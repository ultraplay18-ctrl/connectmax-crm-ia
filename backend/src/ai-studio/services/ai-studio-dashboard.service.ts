import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AiStudioDashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getMetrics(companyId: string) {
    const [totalAgents, activeAgents, totalExecutions, tokenStats, recentExecutions] = await Promise.all([
      this.prisma.aiAgent.count({ where: { companyId } }),
      this.prisma.aiAgent.count({ where: { companyId, status: 'ACTIVE' } }),
      this.prisma.agentExecution.count({ where: { companyId } }),
      this.prisma.agentExecution.aggregate({
        where: { companyId },
        _sum: { totalTokens: true, cost: true },
      }),
      this.prisma.agentExecution.findMany({
        where: { companyId },
        include: { agent: { select: { id: true, name: true, category: true, modelName: true } } },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    return {
      totalAgents,
      activeAgents,
      totalExecutions,
      totalTokens: tokenStats._sum.totalTokens || 0,
      totalCost: tokenStats._sum.cost || 0.0,
      recentExecutions,
    };
  }
}
