import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateKnowledgeBaseDto } from '../dto/create-knowledge.dto';

@Injectable()
export class KnowledgeBaseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(companyId: string, dto: CreateKnowledgeBaseDto) {
    return this.prisma.knowledgeBase.create({
      data: {
        companyId,
        name: dto.name,
        description: dto.description || null,
        agentId: dto.agentId || null,
        status: 'ACTIVE',
      },
    });
  }

  async findAll(companyId: string) {
    return this.prisma.knowledgeBase.findMany({
      where: { companyId },
      include: {
        files: true,
        pages: true,
        agent: { select: { id: true, name: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: string, companyId: string) {
    const kb = await this.prisma.knowledgeBase.findUnique({
      where: { id },
      include: {
        files: true,
        pages: true,
        agent: { select: { id: true, name: true } },
      },
    });

    if (!kb) throw new NotFoundException('Base de conhecimento não encontrada.');
    if (kb.companyId !== companyId) throw new ForbiddenException('Acesso negado.');

    return kb;
  }

  async addSimulatedFile(kbId: string, companyId: string, name: string, fileType: string) {
    await this.findOne(kbId, companyId);
    return this.prisma.knowledgeFile.create({
      data: {
        knowledgeBaseId: kbId,
        name,
        fileType: fileType.toUpperCase(),
        fileSize: Math.floor(Math.random() * 5000000) + 100000,
        status: 'READY',
      },
    });
  }

  async addSimulatedUrl(kbId: string, companyId: string, url: string, title?: string) {
    await this.findOne(kbId, companyId);
    return this.prisma.knowledgePage.create({
      data: {
        knowledgeBaseId: kbId,
        url,
        title: title || url,
        status: 'INDEXED',
      },
    });
  }

  async remove(id: string, companyId: string) {
    await this.findOne(id, companyId);
    await this.prisma.knowledgeBase.delete({ where: { id } });
    return { message: 'Base de conhecimento excluída.' };
  }
}
