import { Injectable, Logger } from '@nestjs/common';
import { ExecutionPipeline } from './execution-pipeline';
import { ExecutionContext } from '../interfaces/execution-context.interface';
import { ExecutionResult } from '../interfaces/execution-result.interface';
import * as crypto from 'crypto';

export interface RunExecutionRequest {
  companyId: string;
  agentId?: string;
  input: string;
  userId?: string;
}

@Injectable()
export class ExecutionService {
  private readonly logger = new Logger(ExecutionService.name);

  constructor(private readonly pipeline: ExecutionPipeline) {}

  async run(req: RunExecutionRequest): Promise<ExecutionResult> {
    const ctx: ExecutionContext = {
      executionId: crypto.randomUUID(),
      companyId: req.companyId,
      agentId: req.agentId,
      userId: req.userId,
      input: req.input,
      status: 'INITIALIZED',
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
      estimatedCostUsd: 0,
      startTime: Date.now(),
      logs: [],
    };

    await this.pipeline.executePipeline(ctx);

    return {
      executionId: ctx.executionId,
      companyId: ctx.companyId,
      agentId: ctx.agentId,
      input: ctx.input,
      output: ctx.outputText || '',
      status: ctx.status === 'FAILED' ? 'FAILED' : 'COMPLETED',
      provider: ctx.provider || 'OpenAI',
      modelName: ctx.modelName || 'gpt-4o',
      latencyMs: ctx.latencyMs || 0,
      tokensUsed: {
        promptTokens: ctx.promptTokens,
        completionTokens: ctx.completionTokens,
        totalTokens: ctx.totalTokens,
      },
      estimatedCostUsd: ctx.estimatedCostUsd,
      toolsExecuted: ctx.toolsResolved || [],
      knowledgeLoaded: !!ctx.knowledgeLoaded,
      memoryLoaded: !!ctx.memoryLoaded,
      error: ctx.error,
      timestamp: new Date().toISOString(),
    };
  }
}
