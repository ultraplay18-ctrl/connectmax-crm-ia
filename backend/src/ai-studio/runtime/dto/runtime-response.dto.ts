export class RuntimeResponseDto {
  executionId: string;
  agentId: string;
  agentName: string;
  conversationId: string;
  input: string;
  output: string;
  status: 'SUCCESS' | 'FAILED' | 'PARTIAL';
  modelName: string;
  provider: string;
  latencyMs: number;
  tokensUsed: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  estimatedCostUsd: number;
  toolsExecuted: string[];
  knowledgeLoaded: boolean;
  memoryLoaded: boolean;
  error?: string;
  timestamp: string;
}
