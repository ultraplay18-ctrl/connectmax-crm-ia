import { Injectable } from '@nestjs/common';
import { BaseAiProvider } from '../base-ai.provider';
import { AiCompletionRequest, AiCompletionResponse } from '../../domain/interfaces/ai-provider.interface';
import { OpenAIRealAdapter } from '../../providers-secrets/adapters/openai-real.adapter';

@Injectable()
export class OpenAIProvider extends BaseAiProvider {
  constructor(private readonly openAIRealAdapter: OpenAIRealAdapter) {
    super();
  }

  getProviderName(): string {
    return 'OpenAI';
  }

  getSupportedModels(): string[] {
    return ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'o1-preview', 'o3-mini'];
  }

  override async generateCompletion(request: AiCompletionRequest): Promise<AiCompletionResponse> {
    const ctx: any = {
      companyId: request.companyId || 'default',
      modelName: request.model || 'gpt-4o',
      systemPrompt: request.systemPrompt || '',
      input: request.prompt,
    };

    const res = await this.openAIRealAdapter.generateResponse(ctx);

    return {
      id: `openai-${Date.now()}`,
      provider: this.getProviderName(),
      model: res.model,
      content: res.output,
      promptTokens: res.promptTokens,
      completionTokens: res.completionTokens,
      totalTokens: res.totalTokens,
      executionTimeMs: res.latencyMs,
      costUsd: res.costUsd,
    };
  }
}
