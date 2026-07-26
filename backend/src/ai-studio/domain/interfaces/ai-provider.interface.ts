export interface AiCompletionRequest {
  companyId?: string;
  model: string;
  prompt: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  tools?: any[];
  memoryContext?: string;
}

export interface AiCompletionResponse {
  id: string;
  provider: string;
  model: string;
  content: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  executionTimeMs: number;
  costUsd?: number;
  rawResponse?: any;
}

export interface IAiProvider {
  getProviderName(): string;
  getSupportedModels(): string[];
  generateCompletion(request: AiCompletionRequest): Promise<AiCompletionResponse>;
}
