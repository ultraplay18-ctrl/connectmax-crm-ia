import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AgentExecutionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(companyId: string, agentId?: string) {
    const where: any = { companyId };
    if (agentId) where.agentId = agentId;

    return this.prisma.agentExecution.findMany({
      where,
      include: {
        agent: { select: { id: true, name: true, category: true, modelName: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
}
