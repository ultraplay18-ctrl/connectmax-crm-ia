export interface ExecutionResult {
  executionId: string;
  companyId: string;
  agentId?: string;
  input: string;
  output: string;
  status: 'COMPLETED' | 'FAILED';
  provider: string;
  modelName: string;
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
