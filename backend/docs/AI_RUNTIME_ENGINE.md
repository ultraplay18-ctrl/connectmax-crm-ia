# Documentação Técnica: AI Runtime Engine — ConnectMax CRM IA

## 1. Visão Geral
O **AI Runtime Engine** é o núcleo de execução, orquestração e telemetria da plataforma ConnectMax CRM IA. Ele gerencia o ciclo de vida completo de cada requisição enviada a um Agente Inteligente, desde a validação inicial do tenant até a persistência de métricas de latência e custo.

---

## 2. Arquitetura & Fluxo do Pipeline (Chain of Responsibility)

Toda chamada executada pelo método `RuntimeService.executeAgent()` passa por um pipeline sequencial e desacoplado composto por 9 estágios:

```
[Requisição] ➔ 1. ValidationStep ➔ 2. ContextStep ➔ 3. MemoryStep ➔ 4. KnowledgeStep ➔ 5. ToolsStep ➔ 6. ProviderStep ➔ 7. ResponseStep ➔ 8. LogsStep ➔ 9. AnalyticsStep ➔ [Resposta]
```

### Detalhamento das Etapas:
1. **ValidationStep**: Valida se a mensagem não é vazia, verifica a existência do agente, o vinculo com a empresa (multi-tenant) e confirma o status `ACTIVE`.
2. **ContextStep**: Compila a instrução mestra combinando System Prompt, Tom de Voz, Idioma, Emoji e Personalidade.
3. **MemoryStep**: Carrega a memória de sessão curta e o histórico recente de conversas.
4. **KnowledgeStep**: Invoca a busca vetorial RAG nas Bases de Conhecimento associadas ao agente.
5. **ToolsStep**: Mapeia as ferramentas nativas habilitadas (CRM, Financeiro, Agenda, WhatsApp) e conectores MCP.
6. **ProviderStep**: Seleciona o provedor correto via `AiProviderFactory` (OpenAI, Claude, Gemini, DeepSeek, Grok, Ollama, OpenRouter) e dispara a chamada LLM.
7. **ResponseStep**: Formata a resposta final e ajusta os tokens de conclusão.
8. **LogsStep**: Registra um log estruturado na tabela `agent_logs` com todos os estágios do pipeline.
9. **AnalyticsStep**: Salva a métrica de execução na tabela `agent_executions` (latência em ms, tokens de entrada/saída, modelo e custo).

---

## 3. Principais Componentes e Injeção de Dependências

- **`RuntimeService`**: Ponto de entrada do serviço NestJS.
- **`RuntimeExecutor`**: Executor do ciclo de vida que gerencia o objeto de contexto (`RuntimeContext`) e emite eventos.
- **`RuntimeContext`**: Estado mutável e isolado mantido durante toda a travessia do pipeline.
- **`RuntimeEventsEmitter`**: Emissor de eventos síncronos e assíncronos (`AgentStarted`, `AgentFinished`, `AgentFailed`, `ToolExecuted`, `KnowledgeLoaded`, `MemoryLoaded`, `ProviderCalled`).
- **`RuntimeLoggerService`**: Gravador de auditoria em `agent_logs`.
- **`RuntimeMetricsService`**: Gravador de métricas e analytics em `agent_executions`.

---

## 4. Endpoints REST da API Runtime

### Executar Agente
```http
POST /api/v1/ai-studio/runtime/execute
Content-Type: application/json
x-tenant-id: <companyId>

{
  "agentId": "uuid-do-agente",
  "input": "Olá! Gostaria de agendar uma reunião comercial.",
  "conversationId": "conv-123",
  "channel": "WEB"
}
```

### Consultar Métricas do Runtime
```http
GET /api/v1/ai-studio/runtime/metrics
x-tenant-id: <companyId>
```
