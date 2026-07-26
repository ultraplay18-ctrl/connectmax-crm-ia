export interface ExecutionContext {
  executionId: string;
  companyId: string;
  agentId?: string;
  userId?: string;
  input: string;

  // Carregamentos do fluxo
  agent?: any;
  systemPrompt?: string;
  history?: any[];
  memoryLoaded?: boolean;
  memoryDetails?: any;
  knowledgeLoaded?: boolean;
  knowledgeChunks?: any[];
  toolsResolved?: string[];
  mcpServersResolved?: string[];

  // Seleção de Provider e Modelo
  provider?: string;
  modelName?: string;

  // Saída e Métricas
  outputText?: string;
  status: 'INITIALIZED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
  startTime: number;
  endTime?: number;
  latencyMs?: number;
  error?: string;
  logs: Array<{ step: string; message: string; timestamp: string }>;
}
