import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AgentLogsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(companyId: string, level?: string, agentId?: string) {
    const where: any = { companyId };
    if (level) where.level = level;
    if (agentId) where.agentId = agentId;

    return this.prisma.agentLog.findMany({
      where,
      include: {
        agent: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }
}
