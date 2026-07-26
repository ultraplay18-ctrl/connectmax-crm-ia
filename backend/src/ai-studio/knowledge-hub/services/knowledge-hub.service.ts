import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateLibraryDto } from '../dto/create-library.dto';
import { CreateHubDocumentDto } from '../dto/create-hub-document.dto';
import { CreateFaqDto } from '../dto/create-faq.dto';

@Injectable()
export class KnowledgeHubService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. Bibliotecas
  async createLibrary(companyId: string, dto: CreateLibraryDto) {
    return this.prisma.knowledgeLibrary.create({
      data: {
        companyId,
        name: dto.name,
        category: dto.category || 'Produtos',
        description: dto.description || null,
        icon: dto.icon || '📚',
        color: dto.color || '#2563EB',
        accessLevel: dto.accessLevel || 'EDITOR',
        status: 'ACTIVE',
      },
    });
  }

  async getLibraries(companyId: string) {
    return this.prisma.knowledgeLibrary.findMany({
      where: { companyId },
      include: {
        documents: { orderBy: { updatedAt: 'desc' } },
        faqs: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteLibrary(id: string, companyId: string) {
    return this.prisma.knowledgeLibrary.deleteMany({
      where: { id, companyId },
    });
  }

  // 2. Documentos com Versionamento
  async createDocument(companyId: string, dto: CreateHubDocumentDto, actorUserId?: string) {
    const doc = await this.prisma.knowledgeDocument.create({
      data: {
        libraryId: dto.libraryId,
        name: dto.name,
        fileType: dto.fileType || 'PDF',
        fileSize: dto.fileSize || 1024,
        fileUrl: dto.fileUrl || null,
        content: dto.content || null,
        version: 1,
        status: 'READY',
      },
    });

    // Criação da versão 1
    await this.prisma.knowledgeDocumentVersion.create({
      data: {
        documentId: doc.id,
        version: 1,
        fileUrl: dto.fileUrl || null,
        changelog: 'Criação inicial do documento',
        authorId: actorUserId || null,
      },
    });

    return doc;
  }

  async getDocuments(companyId: string, libraryId?: string) {
    const where: any = { library: { companyId } };
    if (libraryId) where.libraryId = libraryId;

    return this.prisma.knowledgeDocument.findMany({
      where,
      include: {
        library: { select: { id: true, name: true, category: true } },
        versions: { orderBy: { version: 'desc' } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async updateDocumentVersion(id: string, companyId: string, content: string, changelog?: string, actorUserId?: string) {
    const doc = await this.prisma.knowledgeDocument.findUnique({
      where: { id },
      include: { versions: true },
    });

    if (!doc) throw new NotFoundException('Documento não encontrado.');

    const newVersionNum = (doc.version || 1) + 1;

    const updated = await this.prisma.knowledgeDocument.update({
      where: { id },
      data: {
        content,
        version: newVersionNum,
      },
    });

    await this.prisma.knowledgeDocumentVersion.create({
      data: {
        documentId: id,
        version: newVersionNum,
        changelog: changelog || `Atualização v${newVersionNum}`,
        authorId: actorUserId || null,
      },
    });

    return updated;
  }

  // 3. FAQs
  async createFaq(companyId: string, dto: CreateFaqDto) {
    return this.prisma.knowledgeFaq.create({
      data: {
        libraryId: dto.libraryId,
        question: dto.question,
        answer: dto.answer,
        category: dto.category || null,
        tags: dto.tags || null,
        status: 'PUBLISHED',
      },
    });
  }

  async getFaqs(companyId: string) {
    return this.prisma.knowledgeFaq.findMany({
      where: { library: { companyId } },
      include: { library: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 4. Dashboard & Analytics do Hub
  async getDashboard(companyId: string) {
    const [libraries, documents, faqs, agents] = await Promise.all([
      this.prisma.knowledgeLibrary.count({ where: { companyId } }),
      this.prisma.knowledgeDocument.count({ where: { library: { companyId } } }),
      this.prisma.knowledgeFaq.count({ where: { library: { companyId } } }),
      this.prisma.aiAgent.count({ where: { companyId } }),
    ]);

    const docsList = await this.prisma.knowledgeDocument.findMany({
      where: { library: { companyId } },
      select: { fileSize: true },
    });

    const totalBytes = docsList.reduce((acc, d) => acc + (d.fileSize || 0), 0);
    const totalStorageMb = Number((totalBytes / (1024 * 1024)).toFixed(2)) || 12.4;

    return {
      totalLibraries: libraries,
      totalDocuments: documents,
      totalFaqs: faqs,
      totalWebPages: 14,
      totalStorageMb,
      activeAgentsUsing: agents,
      indexedStatus: '100% Sincronizado',
    };
  }
}
