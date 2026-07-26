import { Injectable, Logger } from '@nestjs/common';
import { RuntimePipeline } from '../pipeline/runtime-pipeline';
import { RuntimeContext } from '../context/runtime-context';
import { RuntimeRequestDto } from '../dto/runtime-request.dto';
import { RuntimeResponseDto } from '../dto/runtime-response.dto';
import { RuntimeEventsEmitter, RuntimeEventType } from '../events/runtime-events.emitter';

@Injectable()
export class RuntimeExecutor {
  private readonly logger = new Logger(RuntimeExecutor.name);

  constructor(
    private readonly pipeline: RuntimePipeline,
    private readonly eventsEmitter: RuntimeEventsEmitter,
  ) {}

  public async run(companyId: string, request: RuntimeRequestDto, userId?: string): Promise<RuntimeResponseDto> {
    const ctx = new RuntimeContext(companyId, request, userId);

    try {
      this.eventsEmitter.emit(RuntimeEventType.AGENT_STARTED, ctx);

      await this.pipeline.executePipeline(ctx);

      this.eventsEmitter.emit(RuntimeEventType.AGENT_FINISHED, ctx, {
        latencyMs: ctx.getLatencyMs(),
        totalTokens: ctx.totalTokens,
      });
    } catch (err: any) {
      this.eventsEmitter.emit(RuntimeEventType.AGENT_FAILED, ctx, {
        error: err.message,
      });
    }

    return this.buildResponse(ctx);
  }

  private buildResponse(ctx: RuntimeContext): RuntimeResponseDto {
    return {
      executionId: ctx.executionId,
      agentId: ctx.agent?.id || ctx.request.agentId,
      agentName: ctx.agent?.name || 'Agente de IA',
      conversationId: ctx.conversationId,
      input: ctx.request.input,
      output: ctx.outputText,
      status: ctx.status,
      modelName: ctx.agent?.modelName || 'gpt-4o',
      provider: ctx.agent?.provider || 'OpenAI',
      latencyMs: ctx.getLatencyMs(),
      tokensUsed: {
        promptTokens: ctx.promptTokens,
        completionTokens: ctx.completionTokens,
        totalTokens: ctx.totalTokens,
      },
      estimatedCostUsd: ctx.estimatedCostUsd,
      toolsExecuted: ctx.toolsExecuted,
      knowledgeLoaded: ctx.knowledgeLoaded,
      memoryLoaded: ctx.memoryLoaded,
      error: ctx.error,
      timestamp: new Date().toISOString(),
    };
  }
}
