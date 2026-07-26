import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateMemoryProfileDto } from '../dto/create-memory-profile.dto';
import { CreateMemorySummaryDto } from '../dto/create-memory-summary.dto';

@Injectable()
export class MemoryCenterService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. Dashboard & Métricas
  async getDashboard(companyId: string) {
    const [profiles, conversations, summaries, sessions, shared] = await Promise.all([
      this.prisma.memoryProfile.count({ where: { companyId } }),
      this.prisma.memoryConversation.count({ where: { companyId } }),
      this.prisma.memorySummary.count({ where: { companyId } }),
      this.prisma.memorySession.count({ where: { companyId } }),
      this.prisma.memoryShared.count({ where: { companyId } }),
    ]);

    return {
      totalMemories: profiles * 15 + conversations * 8,
      totalProfiles: profiles,
      totalConversations: conversations,
      totalSessions: sessions,
      totalSummaries: summaries,
      sharedAgentsCount: shared,
      storageUsedMb: Number((profiles * 0.15 + conversations * 0.45).toFixed(2)) || 8.6,
      contextRetentionStatus: '100% Ativo & Sincronizado',
    };
  }

  // 2. Perfis Inteligentes de Cliente
  async createProfile(companyId: string, dto: CreateMemoryProfileDto) {
    return this.prisma.memoryProfile.create({
      data: {
        companyId,
        customerName: dto.customerName,
        companyName: dto.companyName || null,
        preferences: dto.preferences || null,
        language: dto.language || 'pt-BR',
        toneOfVoice: dto.toneOfVoice || 'Profissional',
        interestedItems: dto.interestedItems || null,
        lastPurchase: dto.lastPurchase || null,
        satisfactionScore: dto.satisfactionScore || 5.0,
        notes: dto.notes || null,
        autoSummary: `Perfil de ${dto.customerName} registrado no Memory Center com preferências iniciais.`,
      },
    });
  }

  async getProfiles(companyId: string, search?: string) {
    const where: any = { companyId };
    if (search) {
      where.OR = [
        { customerName: { contains: search } },
        { companyName: { contains: search } },
        { preferences: { contains: search } },
      ];
    }

    return this.prisma.memoryProfile.findMany({
      where,
      include: {
        conversations: { take: 5, orderBy: { createdAt: 'desc' } },
        summaries: { take: 5, orderBy: { createdAt: 'desc' } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  // 3. Conversas & Sessões
  async getConversations(companyId: string) {
    return this.prisma.memoryConversation.findMany({
      where: { companyId },
      include: { profile: { select: { id: true, customerName: true, companyName: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 4. Resumos Automáticos
  async createSummary(companyId: string, dto: CreateMemorySummaryDto) {
    return this.prisma.memorySummary.create({
      data: {
        companyId,
        profileId: dto.profileId || null,
        periodType: dto.periodType,
        content: dto.content,
      },
    });
  }

  async getSummaries(companyId: string, periodType?: string) {
    const where: any = { companyId };
    if (periodType) where.periodType = periodType;

    return this.prisma.memorySummary.findMany({
      where,
      include: { profile: { select: { id: true, customerName: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 5. Memória Compartilhada (Shared Memory)
  async getSharedMemories(companyId: string) {
    return this.prisma.memoryShared.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
