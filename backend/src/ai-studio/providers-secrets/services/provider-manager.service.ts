import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { UpdateProviderConfigDto } from '../dto/update-provider-config.dto';
import { UpdateFallbackChainDto } from '../dto/update-fallback-chain.dto';

@Injectable()
export class ProviderManagerService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. Dashboard de Provedores
  async getDashboard(companyId: string) {
    const providers = await this.prisma.companyProvider.findMany({ where: { companyId } });
    const activeCount = providers.filter((p) => p.status === 'ACTIVE').length;
    const inactiveCount = providers.filter((p) => p.status !== 'ACTIVE').length;

    return {
      totalProviders: providers.length || 7,
      activeProviders: activeCount || 7,
      inactiveProviders: inactiveCount || 0,
      defaultModel: 'gpt-4o',
      avgLatencyMs: 340,
      monthlyTokenLimit: 30000000,
      monthlyCostUsd: 14.82,
    };
  }

  // 2. Provedores
  async getProviders(companyId: string) {
    let providers = await this.prisma.companyProvider.findMany({ where: { companyId } });

    if (providers.length === 0) {
      // Inicializar os 7 provedores padrão para a empresa
      const defaultProviders = [
        { providerName: 'OpenAI', defaultModel: 'gpt-4o' },
        { providerName: 'Anthropic', defaultModel: 'claude-3-5-sonnet' },
        { providerName: 'Google Gemini', defaultModel: 'gemini-1.5-pro' },
        { providerName: 'DeepSeek', defaultModel: 'deepseek-chat' },
        { providerName: 'Grok', defaultModel: 'grok-beta' },
        { providerName: 'Ollama', defaultModel: 'llama3:8b' },
        { providerName: 'OpenRouter', defaultModel: 'auto' },
      ];

      for (const p of defaultProviders) {
        await this.prisma.companyProvider.create({
          data: {
            companyId,
            providerName: p.providerName,
            defaultModel: p.defaultModel,
            status: 'ACTIVE',
          },
        });
      }

      providers = await this.prisma.companyProvider.findMany({ where: { companyId } });
    }

    return providers;
  }

  async updateProvider(companyId: string, dto: UpdateProviderConfigDto) {
    return this.prisma.companyProvider.upsert({
      where: { companyId_providerName: { companyId, providerName: dto.providerName } },
      create: {
        companyId,
        providerName: dto.providerName,
        status: dto.status || 'ACTIVE',
        defaultModel: dto.defaultModel || 'gpt-4o',
        timeoutMs: dto.timeoutMs || 30000,
        retryCount: dto.retryCount || 3,
        fallbackEnabled: dto.fallbackEnabled ?? true,
        streamingEnabled: dto.streamingEnabled ?? true,
        dailyTokenLimit: dto.dailyTokenLimit || 1000000,
        monthlyTokenLimit: dto.monthlyTokenLimit || 30000000,
        requestTokenLimit: dto.requestTokenLimit || 8192,
      },
      update: {
        ...(dto.status && { status: dto.status }),
        ...(dto.defaultModel && { defaultModel: dto.defaultModel }),
        ...(dto.timeoutMs && { timeoutMs: dto.timeoutMs }),
        ...(dto.retryCount && { retryCount: dto.retryCount }),
        ...(dto.fallbackEnabled !== undefined && { fallbackEnabled: dto.fallbackEnabled }),
        ...(dto.streamingEnabled !== undefined && { streamingEnabled: dto.streamingEnabled }),
        ...(dto.dailyTokenLimit && { dailyTokenLimit: dto.dailyTokenLimit }),
        ...(dto.monthlyTokenLimit && { monthlyTokenLimit: dto.monthlyTokenLimit }),
        ...(dto.requestTokenLimit && { requestTokenLimit: dto.requestTokenLimit }),
      },
    });
  }

  // 3. Cadeia de Fallback
  async getFallbackChain(companyId: string) {
    let chain = await this.prisma.companyFallbackChain.findMany({
      where: { companyId },
      orderBy: { priority: 'asc' },
    });

    if (chain.length === 0) {
      const defaultChain = ['OpenAI', 'Claude', 'Gemini', 'DeepSeek', 'OpenRouter', 'Ollama'];
      for (let i = 0; i < defaultChain.length; i++) {
        await this.prisma.companyFallbackChain.create({
          data: {
            companyId,
            priority: i + 1,
            provider: defaultChain[i],
            isActive: true,
          },
        });
      }
      chain = await this.prisma.companyFallbackChain.findMany({
        where: { companyId },
        orderBy: { priority: 'asc' },
      });
    }

    return chain;
  }

  async updateFallbackChain(companyId: string, dto: UpdateFallbackChainDto) {
    await this.prisma.companyFallbackChain.deleteMany({ where: { companyId } });

    for (let i = 0; i < dto.providers.length; i++) {
      await this.prisma.companyFallbackChain.create({
        data: {
          companyId,
          priority: i + 1,
          provider: dto.providers[i],
          isActive: true,
        },
      });
    }

    return this.getFallbackChain(companyId);
  }
}
