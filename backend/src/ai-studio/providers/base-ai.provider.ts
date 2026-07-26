import { IAiProvider, AiCompletionRequest, AiCompletionResponse } from '../domain/interfaces/ai-provider.interface';

export abstract class BaseAiProvider implements IAiProvider {
  abstract getProviderName(): string;
  abstract getSupportedModels(): string[];

  async generateCompletion(request: AiCompletionRequest): Promise<AiCompletionResponse> {
    const startTime = Date.now();
    
    // Stub simulado para infraestrutura sem chamadas externas
    const content = `[${this.getProviderName()} - ${request.model}] Resposta simulada para a instrução: "${request.prompt.substring(0, 50)}..."`;
    const promptTokens = Math.ceil((request.prompt.length + (request.systemPrompt?.length || 0)) / 4);
    const completionTokens = Math.ceil(content.length / 4);

    return {
      id: `exec-${Date.now()}`,
      provider: this.getProviderName(),
      model: request.model,
      content,
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens,
      executionTimeMs: Date.now() - startTime,
    };
  }
}
