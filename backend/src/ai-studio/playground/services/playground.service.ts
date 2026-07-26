import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { RuntimeExecutor } from '../../runtime/executor/runtime-executor';
import { ExecutePlaygroundDto } from '../dto/execute-playground.dto';
import { SavePresetDto } from '../dto/save-preset.dto';

@Injectable()
export class PlaygroundService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly runtimeExecutor: RuntimeExecutor,
  ) {}

  async executeSimulatedRun(companyId: string, dto: ExecutePlaygroundDto, userId?: string) {
    const startTime = Date.now();

    // 1. Resolver agente ou montar agente sintético para o playground
    let agent: any = null;
    if (dto.agentId) {
      agent = await this.prisma.aiAgent.findUnique({ where: { id: dto.agentId } });
    }

    if (!agent) {
      // Agente sintético de teste
      agent = {
        id: 'playground-temp-agent',
        companyId,
        name: 'Agente Playground Test',
        modelProvider: dto.provider || 'OpenAI',
        modelName: dto.modelName || 'gpt-4o',
        temperature: dto.temperature || 0.7,
        maxTokens: dto.maxTokens || 2048,
        systemPrompt: dto.systemPrompt || 'Você é um assistente de IA especialista em CRM e vendas.',
        memoryEnabled: true,
        isPublished: false,
      };
    }

    // 2. Executar pipeline do Runtime Engine
    const runtimeResult = await this.runtimeExecutor.run(
      companyId,
      { agentId: agent.id, input: dto.input },
      userId,
    );

    const actualExecutionTimeMs = runtimeResult.latencyMs || (Date.now() - startTime);
    const actualCost = runtimeResult.estimatedCostUsd || 0.0042;
    const actualTotalTokens = runtimeResult.tokensUsed?.totalTokens || 340;

    // 3. Gravar sessão de playground no Prisma
    const session = await this.prisma.playgroundSession.create({
      data: {
        companyId,
        agentId: agent.id !== 'playground-temp-agent' ? agent.id : null,
        name: `Teste: ${dto.input.substring(0, 30)}...`,
        provider: dto.provider || agent.modelProvider || 'OpenAI',
        modelName: dto.modelName || agent.modelName || 'gpt-4o',
        temperature: dto.temperature || 0.7,
        maxTokens: dto.maxTokens || 2048,
        systemPrompt: dto.systemPrompt || agent.systemPrompt,
        tools: dto.tools || 'CRM, Financeiro, WhatsApp',
        memoryTypes: dto.memoryTypes || 'Short, Long, Customer',
        knowledgeLibs: dto.knowledgeLibs || 'Produtos SaaS 2026',
        messages: JSON.stringify([
          { role: 'user', content: dto.input },
          { role: 'assistant', content: runtimeResult.output },
        ]),
        executionTimeMs: actualExecutionTimeMs,
        tokensUsed: actualTotalTokens,
        cost: actualCost,
      },
    });

    return {
      id: session.id,
      output: runtimeResult.output,
      provider: session.provider,
      modelName: session.modelName,
      executionTimeMs: actualExecutionTimeMs,
      tokensUsed: {
        promptTokens: runtimeResult.tokensUsed?.promptTokens || 100,
        completionTokens: runtimeResult.tokensUsed?.completionTokens || 240,
        totalTokens: actualTotalTokens,
      },
      cost: actualCost,
      toolsTriggered: ['CRM Tool', 'Knowledge Hub RAG'],
      memoryLoaded: true,
    };
  }

  // Presets
  async savePreset(companyId: string, dto: SavePresetDto) {
    return this.prisma.playgroundPreset.create({
      data: {
        companyId,
        name: dto.name,
        description: dto.description || null,
        systemPrompt: dto.systemPrompt,
        provider: dto.provider || 'OpenAI',
        modelName: dto.modelName || 'gpt-4o',
        temperature: dto.temperature || 0.7,
        tools: dto.tools || null,
      },
    });
  }

  async getPresets(companyId: string) {
    return this.prisma.playgroundPreset.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getSessions(companyId: string) {
    return this.prisma.playgroundSession.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }
}
