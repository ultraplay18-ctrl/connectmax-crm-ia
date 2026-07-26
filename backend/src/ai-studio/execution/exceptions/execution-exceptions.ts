export class ProviderUnavailableException extends Error {
  constructor(providerName: string) {
    super(`O Provedor de IA '${providerName}' está temporariamente indisponível.`);
    this.name = 'ProviderUnavailableException';
  }
}

export class ExecutionTimeoutException extends Error {
  constructor(timeoutMs: number) {
    super(`A execução excedeu o tempo limite de ${timeoutMs}ms.`);
    this.name = 'ExecutionTimeoutException';
  }
}

export class ToolExecutionException extends Error {
  constructor(toolName: string, message: string) {
    super(`Falha na execução da ferramenta '${toolName}': ${message}`);
    this.name = 'ToolExecutionException';
  }
}

export class McpConnectorException extends Error {
  constructor(mcpServerName: string, message: string) {
    super(`Falha de conexão com o servidor MCP '${mcpServerName}': ${message}`);
    this.name = 'McpConnectorException';
  }
}

export class MemoryRetrievalException extends Error {
  constructor(message: string) {
    super(`Falha ao recuperar registros do Memory Center: ${message}`);
    this.name = 'MemoryRetrievalException';
  }
}

export class KnowledgeRagException extends Error {
  constructor(message: string) {
    super(`Falha na busca semântica RAG do Knowledge Hub: ${message}`);
    this.name = 'KnowledgeRagException';
  }
}
