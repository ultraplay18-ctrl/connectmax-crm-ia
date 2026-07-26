import { Module } from '@nestjs/common';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';

// Controllers
import { AiAgentsController } from './controllers/ai-agents.controller';
import { AiModelsController } from './controllers/ai-models.controller';
import { KnowledgeBaseController } from './controllers/knowledge-base.controller';
import { AiToolsController } from './controllers/ai-tools.controller';
import { AgentExecutionsController } from './controllers/agent-executions.controller';
import { AgentLogsController } from './controllers/agent-logs.controller';
import { AiStudioDashboardController } from './controllers/ai-studio-dashboard.controller';
import { McpController } from './controllers/mcp.controller';
import { RuntimeController } from './runtime/controllers/runtime.controller';
import { KnowledgeHubController } from './knowledge-hub/controllers/knowledge-hub.controller';
import { MemoryCenterController } from './memory-center/controllers/memory-center.controller';
import { PlaygroundController } from './playground/controllers/playground.controller';
import { ExecutionController } from './execution/controllers/execution.controller';
import { SecretsController } from './providers-secrets/controllers/secrets.controller';
import { ProvidersController } from './providers-secrets/controllers/providers.controller';

// Secrets & Provider Services
import { SecretsManagerService } from './providers-secrets/services/secrets-manager.service';
import { ProviderManagerService } from './providers-secrets/services/provider-manager.service';
import { EncryptionService } from './providers-secrets/crypto/encryption.service';
import { OpenAIRealAdapter } from './providers-secrets/adapters/openai-real.adapter';

// Execution Engine Core
import { ExecutionService } from './execution/services/execution.service';
import { ExecutionPipeline } from './execution/services/execution-pipeline';
import { ExecutionEventsEmitter } from './execution/events/execution-events.emitter';
import { ExecutionLoggerService } from './execution/logger/execution-logger.service';
import { ExecutionMetricsService } from './execution/metrics/execution-metrics.service';
import { SimulatedProviderAdapter } from './execution/adapters/simulated-provider.adapter';

// Services
import { AiAgentsService } from './services/ai-agents.service';
import { AiModelsService } from './services/ai-models.service';
import { KnowledgeBaseService } from './services/knowledge-base.service';
import { AiToolsService } from './services/ai-tools.service';
import { AgentExecutionsService } from './services/agent-executions.service';
import { AgentLogsService } from './services/agent-logs.service';
import { AiStudioDashboardService } from './services/ai-studio-dashboard.service';
import { McpService } from './services/mcp.service';
import { PromptGeneratorService } from './services/prompt-generator.service';
import { KnowledgeHubService } from './knowledge-hub/services/knowledge-hub.service';
import { MemoryCenterService } from './memory-center/services/memory-center.service';
import { PlaygroundService } from './playground/services/playground.service';

// Runtime Engine Layer
import { RuntimeService } from './runtime/services/runtime.service';
import { RuntimeExecutor } from './runtime/executor/runtime-executor';
import { RuntimePipeline } from './runtime/pipeline/runtime-pipeline';
import { RuntimeEventsEmitter } from './runtime/events/runtime-events.emitter';
import { RuntimeLoggerService } from './runtime/logger/runtime-logger.service';
import { RuntimeMetricsService } from './runtime/metrics/runtime-metrics.service';

// Runtime Pipeline Steps
import { ValidationStep } from './runtime/pipeline/steps/validation.step';
import { ContextStep } from './runtime/pipeline/steps/context.step';
import { MemoryStep } from './runtime/pipeline/steps/memory.step';
import { KnowledgeStep } from './runtime/pipeline/steps/knowledge.step';
import { ToolsStep } from './runtime/pipeline/steps/tools.step';
import { ProviderStep } from './runtime/pipeline/steps/provider.step';
import { ResponseStep } from './runtime/pipeline/steps/response.step';
import { LogsStep } from './runtime/pipeline/steps/logs.step';
import { AnalyticsStep } from './runtime/pipeline/steps/analytics.step';

// Providers & Tools Registries
import { AiProviderFactory } from './providers/ai-provider.factory';
import { OpenAIProvider } from './providers/implementations/openai.provider';
import { ClaudeProvider } from './providers/implementations/claude.provider';
import { GeminiProvider } from './providers/implementations/gemini.provider';
import { DeepSeekProvider } from './providers/implementations/deepseek.provider';
import { GrokProvider } from './providers/implementations/grok.provider';
import { OllamaProvider } from './providers/implementations/ollama.provider';
import { OpenRouterProvider } from './providers/implementations/openrouter.provider';

// MCP Architecture
import { McpProvider } from './mcp/mcp.provider';
import { McpClient } from './mcp/mcp.client';
import { McpRegistry } from './mcp/mcp.registry';
import { McpToolAdapter } from './mcp/mcp-tool.adapter';
import { McpServerManager } from './mcp/mcp-server.manager';

// Native Tools Registry
import { ToolRegistry } from './tools/tool.registry';

@Module({
  imports: [AuditLogsModule],
  controllers: [
    AiAgentsController,
    AiModelsController,
    KnowledgeBaseController,
    AiToolsController,
    AgentExecutionsController,
    AgentLogsController,
    AiStudioDashboardController,
    McpController,
    RuntimeController,
    KnowledgeHubController,
    MemoryCenterController,
    PlaygroundController,
    ExecutionController,
    SecretsController,
    ProvidersController,
  ],
  providers: [
    AiAgentsService,
    AiModelsService,
    KnowledgeBaseService,
    AiToolsService,
    AgentExecutionsService,
    AgentLogsService,
    AiStudioDashboardService,
    McpService,
    PromptGeneratorService,
    KnowledgeHubService,
    MemoryCenterService,
    PlaygroundService,

    // Secrets & Provider Management Layer
    SecretsManagerService,
    ProviderManagerService,
    EncryptionService,
    OpenAIRealAdapter,

    // Execution Engine Layer
    ExecutionService,
    ExecutionPipeline,
    ExecutionEventsEmitter,
    ExecutionLoggerService,
    ExecutionMetricsService,
    SimulatedProviderAdapter,

    // Runtime Core Engine
    RuntimeService,
    RuntimeExecutor,
    RuntimePipeline,
    RuntimeEventsEmitter,
    RuntimeLoggerService,
    RuntimeMetricsService,

    // Pipeline Steps
    ValidationStep,
    ContextStep,
    MemoryStep,
    KnowledgeStep,
    ToolsStep,
    ProviderStep,
    ResponseStep,
    LogsStep,
    AnalyticsStep,
    
    // LLM Providers Strategy / Factory
    AiProviderFactory,
    OpenAIProvider,
    ClaudeProvider,
    GeminiProvider,
    DeepSeekProvider,
    GrokProvider,
    OllamaProvider,
    OpenRouterProvider,

    // MCP Layer
    McpProvider,
    McpClient,
    McpRegistry,
    McpToolAdapter,
    McpServerManager,

    // Native Tools
    ToolRegistry,
  ],
  exports: [
    AiAgentsService,
    AiModelsService,
    KnowledgeBaseService,
    AiToolsService,
    McpService,
    AiProviderFactory,
    McpProvider,
    ToolRegistry,
    RuntimeService,
    RuntimeExecutor,
    MemoryCenterService,
    PlaygroundService,
    ExecutionService,
    ExecutionPipeline,
    SecretsManagerService,
    ProviderManagerService,
    EncryptionService,
    OpenAIRealAdapter,
  ],
})
export class AiStudioModule {}
