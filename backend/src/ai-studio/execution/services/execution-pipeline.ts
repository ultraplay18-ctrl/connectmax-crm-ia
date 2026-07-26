import { Injectable, Logger } from '@nestjs/common';
import { ExecutionContext } from '../interfaces/execution-context.interface';
import { ExecutionEventsEmitter, ExecutionEventType } from '../events/execution-events.emitter';
import { ExecutionLoggerService } from '../logger/execution-logger.service';
import { ExecutionMetricsService } from '../metrics/execution-metrics.service';
import { SimulatedProviderAdapter } from '../adapters/simulated-provider.adapter';
import { OpenAIRealAdapter } from '../../providers-secrets/adapters/openai-real.adapter';
import { MemoryCenterService } from '../../memory-center/services/memory-center.service';
import { KnowledgeHubService } from '../../knowledge-hub/services/knowledge-hub.service';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class ExecutionPipeline {
  private readonly logger = new Logger(ExecutionPipeline.name);

  constructor(
    private readonly eventsEmitter: ExecutionEventsEmitter,
    private readonly loggerService: ExecutionLoggerService,
    private readonly metricsService: ExecutionMetricsService,
    private readonly simulatedAdapter: SimulatedProviderAdapter,
    private readonly openAIRealAdapter: OpenAIRealAdapter,
    private readonly memoryCenterService: MemoryCenterService,
    private readonly knowledgeHubService: KnowledgeHubService,
    private readonly prisma: PrismaService,
  ) {}

  async executePipeline(ctx: ExecutionContext): Promise<void> {
    try {
      // 1. Inicializar Agente
      await this.loggerService.logStep(ctx, 'InitializationStep', 'Inicializando dados do agente e sessão.');
      if (ctx.agentId && !ctx.agent) {
        ctx.agent = await this.prisma.aiAgent.findUnique({ where: { id: ctx.agentId } });
      }
      if (!ctx.agent) {
        ctx.agent = {
          id: 'temp-execution-agent',
          name: 'Agente Conectado AI Studio',
          modelProvider: 'OpenAI',
          modelName: 'gpt-4o',
          systemPrompt: 'Você é um assistente virtual especialista.',
          memoryEnabled: true,
        };
      }
      ctx.provider = ctx.agent.modelProvider || 'OpenAI';
      ctx.modelName = ctx.agent.modelName || 'gpt-4o';
      this.eventsEmitter.emit(ExecutionEventType.ENGINE_INITIALIZED, ctx);

      // 2. Carregar Prompt
      await this.loggerService.logStep(ctx, 'PromptStep', 'Carregando System Prompt e variáveis.');
      ctx.systemPrompt = ctx.agent.systemPrompt || 'Você é um assistente de IA.';
      this.eventsEmitter.emit(ExecutionEventType.PROMPT_LOADED, ctx);

      // 3. Carregar Memória (Memory Center)
      await this.loggerService.logStep(ctx, 'MemoryStep', 'Carregando registros no Memory Center.');
      const profiles = await this.memoryCenterService.getProfiles(ctx.companyId);
      if (profiles && profiles.length > 0) {
        ctx.memoryLoaded = true;
        ctx.memoryDetails = profiles[0];
        ctx.systemPrompt += `\n[Memory Center - Cliente: ${profiles[0].customerName} | Tom: ${profiles[0].toneOfVoice || 'Profissional'}]`;
      }
      this.eventsEmitter.emit(ExecutionEventType.MEMORY_LOADED, ctx);

      // 4. Carregar Base de Conhecimento (Knowledge Hub)
      await this.loggerService.logStep(ctx, 'KnowledgeStep', 'Carregando bibliotecas RAG no Knowledge Hub.');
      const docs = await this.knowledgeHubService.getDocuments(ctx.companyId);
      if (docs && docs.length > 0) {
        ctx.knowledgeLoaded = true;
        ctx.knowledgeChunks = docs.slice(0, 3);
        ctx.systemPrompt += `\n[Knowledge Hub RAG - Documento: ${docs[0].name}]`;
      }
      this.eventsEmitter.emit(ExecutionEventType.KNOWLEDGE_LOADED, ctx);

      // 5. Resolver Ferramentas (Tool Registry & MCP)
      await this.loggerService.logStep(ctx, 'ToolsStep', 'Resolvendo ferramentas ativas e conectores MCP.');
      ctx.toolsResolved = ['CRM Tool', 'Financeiro Tool', 'WhatsApp Tool', 'Knowledge Tool', 'Memory Tool'];
      ctx.mcpServersResolved = ['PostgreSQL Server', 'GitHub Server'];
      this.eventsEmitter.emit(ExecutionEventType.TOOLS_RESOLVED, ctx);

      // 6. Selecionar Provider e Gerar Resposta (OpenAI Real vs Simulated)
      await this.loggerService.logStep(ctx, 'ProviderStep', `Selecionando Provider Adapter: ${ctx.provider}`);
      if (ctx.provider === 'OpenAI') {
        const res = await this.openAIRealAdapter.generateResponse(ctx);
        ctx.outputText = res.output;
        ctx.promptTokens = res.promptTokens;
        ctx.completionTokens = res.completionTokens;
        ctx.totalTokens = res.totalTokens;
        ctx.estimatedCostUsd = res.costUsd;
      } else {
        ctx.outputText = await this.simulatedAdapter.generateResponse(ctx);
      }
      ctx.status = 'COMPLETED';
      this.eventsEmitter.emit(ExecutionEventType.RESPONSE_GENERATED, ctx);

      // 7. Gravação Automática pós-resposta no Memory Center
      try {
        await this.prisma.memoryConversation.create({
          data: {
            companyId: ctx.companyId,
            profileId: ctx.memoryDetails?.id || null,
            agentId: ctx.agentId || null,
            channel: 'AI_PLAYGROUND',
            messages: JSON.stringify([
              { role: 'user', content: ctx.input },
              { role: 'assistant', content: ctx.outputText },
            ]),
          },
        });
      } catch (memErr) {
        this.logger.warn(`Erro ao auto-salvar conversa no Memory Center: ${memErr}`);
      }

      // 8. Registrar Logs e Métricas
      await this.loggerService.logStep(ctx, 'AnalyticsStep', 'Registrando métricas de tokens, latência e custos.');
      await this.metricsService.recordExecutionMetrics(ctx);
      await this.loggerService.persistLogs(ctx);
      this.eventsEmitter.emit(ExecutionEventType.EXECUTION_LOGGED, ctx);
    } catch (err: any) {
      ctx.status = 'FAILED';
      ctx.error = err.message;
      await this.loggerService.logStep(ctx, 'ErrorStep', `Erro na execução: ${err.message}`);
      await this.metricsService.recordExecutionMetrics(ctx);
      await this.loggerService.persistLogs(ctx);
      this.eventsEmitter.emit(ExecutionEventType.EXECUTION_FAILED, ctx, { error: err.message });
      throw err;
    }
  }
}
