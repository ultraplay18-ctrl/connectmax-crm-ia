import { RuntimeRequestDto } from '../dto/runtime-request.dto';

export class RuntimeContext {
  public executionId: string;
  public companyId: string;
  public userId?: string;
  public request: RuntimeRequestDto;
  public startTime: number;
  public endTime?: number;

  // Dados do Agente Carregado
  public agent?: any;
  public systemPrompt: string = '';
  public compiledPrompt: string = '';

  // Memória & Histórico
  public conversationId: string;
  public history: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [];
  public memoryLoaded: boolean = false;

  // Conhecimento RAG
  public knowledgeSnippets: string[] = [];
  public knowledgeLoaded: boolean = false;

  // Ferramentas Habilitadas & Executadas
  public toolsConfig: Record<string, any> = {};
  public toolsExecuted: string[] = [];
  public toolResults: Array<{ toolName: string; input: any; result: any }> = [];

  // Resposta & Telemetria
  public outputText: string = '';
  public status: 'SUCCESS' | 'FAILED' | 'PARTIAL' = 'SUCCESS';
  public error?: string;

  // Métricas
  public promptTokens: number = 0;
  public completionTokens: number = 0;
  public totalTokens: number = 0;
  public estimatedCostUsd: number = 0.0;

  // Logs Internos de Execução
  public logs: Array<{ timestamp: string; stage: string; message: string; data?: any }> = [];

  constructor(companyId: string, request: RuntimeRequestDto, userId?: string) {
    this.executionId = `exec-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    this.companyId = companyId;
    this.request = request;
    this.userId = userId;
    this.conversationId = request.conversationId || `conv-${Date.now()}`;
    this.startTime = Date.now();
    this.addLog('INITIALIZED', 'RuntimeContext criado e inicializado.');
  }

  public addLog(stage: string, message: string, data?: any) {
    this.logs.push({
      timestamp: new Date().toISOString(),
      stage,
      message,
      data,
    });
  }

  public getLatencyMs(): number {
    return (this.endTime || Date.now()) - this.startTime;
  }
}
