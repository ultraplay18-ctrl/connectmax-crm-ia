# AI Execution Engine — Documentação Técnica (Sprint 3.8)

## 📌 Visão Geral
A **AI Execution Engine** é o motor de execução e orquestração do ConnectMax CRM IA. Responsável por receber requisições de agentes de IA e unificar a pipeline de 9 etapas:

```
Usuário ↓ Agente ↓ Runtime ↓ Memory ↓ Knowledge ↓ Tools ↓ Provider ↓ Resposta ↓ Logs ↓ Analytics
```

---

## 🏗️ Arquitetura e Componentes

### 1. `ExecutionService`
Ponto de entrada único e thread-safe para invocações da Engine. Recebe o contrato `RunExecutionRequest` e inicializa o `ExecutionContext`.

### 2. `ExecutionPipeline`
Orquestrador que executa em ordem sequencial e determinística:
1. `InitializationStep`: Carrega dados da empresa e dados sintéticos do agente.
2. `PromptStep`: Compila o System Prompt com variáveis ativas.
3. `MemoryStep`: Consulta o **Memory Center** (Perfis de Clientes e Memória Compartilhada).
4. `KnowledgeStep`: Executa busca semântica RAG nas bibliotecas do **Knowledge Hub**.
5. `ToolsStep`: Resolve ferramentas habilitadas no **Tool Registry** e conectores **MCP**.
6. `ProviderStep`: Aciona a estratégia do provedor via `SimulatedProviderAdapter`.
7. `ResponseStep`: Formata a resposta textual final.
8. `LogsStep`: Persiste registros em `AgentLog`.
9. `AnalyticsStep`: Grava latência (ms), contagem de tokens e custo em `AgentExecution`.

### 3. Camada de Adaptadores (`ProviderAdapterInterface`)
O adaptadores atuam desacoplados da arquitetura. O `SimulatedProviderAdapter` implementa respostas determinísticas para os 7 provedores suportados (OpenAI, Claude, Gemini, DeepSeek, Grok, Ollama, OpenRouter), permitindo que a injeção de chaves reais de API ocorra na próxima sprint sem alterar nenhuma linha da estrutura física.

### 4. Tratamento Resiliente de Erros
- `ProviderUnavailableException`
- `ExecutionTimeoutException`
- `ToolExecutionException`
- `McpConnectorException`
- `MemoryRetrievalException`
- `KnowledgeRagException`

### 5. Preparação para Streaming (`StreamAdapterInterface`)
Estrutura de observables reativos pronta para transmissão de tokens delta via Server-Sent Events (SSE).

---

## ⚡ Endpoint REST
`POST /api/v1/ai-studio/execution/run`
- **Guards**: `JwtAuthGuard`, `TenantGuard`
- **Body**: `{ "agentId": "uuid", "input": "Pergunta do usuário" }`
