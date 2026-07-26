import { Injectable, Logger } from '@nestjs/common';
import { ExecutionContext } from '../interfaces/execution-context.interface';

export enum ExecutionEventType {
  ENGINE_INITIALIZED = 'engine.initialized',
  PROMPT_LOADED = 'engine.prompt_loaded',
  MEMORY_LOADED = 'engine.memory_loaded',
  KNOWLEDGE_LOADED = 'engine.knowledge_loaded',
  TOOLS_RESOLVED = 'engine.tools_resolved',
  PROVIDER_SELECTED = 'engine.provider_selected',
  RESPONSE_GENERATED = 'engine.response_generated',
  EXECUTION_LOGGED = 'engine.execution_logged',
  METRICS_RECORDED = 'engine.metrics_recorded',
  EXECUTION_FAILED = 'engine.execution_failed',
}

@Injectable()
export class ExecutionEventsEmitter {
  private readonly logger = new Logger(ExecutionEventsEmitter.name);

  emit(type: ExecutionEventType, ctx: ExecutionContext, payload?: any) {
    this.logger.log(`[Event: ${type}] ExecID: ${ctx.executionId} - ${JSON.stringify(payload || {})}`);
  }
}
