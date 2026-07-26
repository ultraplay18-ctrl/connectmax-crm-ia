import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter } from 'events';
import { RuntimeContext } from '../context/runtime-context';

export enum RuntimeEventType {
  AGENT_STARTED = 'agent.started',
  AGENT_FINISHED = 'agent.finished',
  AGENT_FAILED = 'agent.failed',
  TOOL_EXECUTED = 'tool.executed',
  KNOWLEDGE_LOADED = 'knowledge.loaded',
  MEMORY_LOADED = 'memory.loaded',
  PROVIDER_CALLED = 'provider.called',
}

export interface RuntimeEventPayload {
  eventType: RuntimeEventType;
  executionId: string;
  agentId: string;
  companyId: string;
  timestamp: string;
  data?: any;
}

@Injectable()
export class RuntimeEventsEmitter {
  private readonly logger = new Logger(RuntimeEventsEmitter.name);
  private readonly internalEmitter = new EventEmitter();

  public emit(eventType: RuntimeEventType, ctx: RuntimeContext, data?: any) {
    const payload: RuntimeEventPayload = {
      eventType,
      executionId: ctx.executionId,
      agentId: ctx.agent?.id || ctx.request.agentId,
      companyId: ctx.companyId,
      timestamp: new Date().toISOString(),
      data,
    };

    this.logger.log(`[Event: ${eventType}] Execution: ${ctx.executionId} | Agent: ${payload.agentId}`);

    ctx.addLog(eventType, `Evento emitido: ${eventType}`, data);
    this.internalEmitter.emit(eventType, payload);
  }

  public on(eventType: RuntimeEventType, listener: (payload: RuntimeEventPayload) => void) {
    this.internalEmitter.on(eventType, listener);
  }
}
