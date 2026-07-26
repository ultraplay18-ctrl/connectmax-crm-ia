import { Injectable } from '@nestjs/common';
import { RuntimePipelineStep } from '../pipeline-step.interface';
import { RuntimeContext } from '../../context/runtime-context';
import { RuntimeEventsEmitter, RuntimeEventType } from '../../events/runtime-events.emitter';

@Injectable()
export class ToolsStep implements RuntimePipelineStep {
  readonly name = 'ToolsStep';

  constructor(private readonly eventsEmitter: RuntimeEventsEmitter) {}

  async execute(ctx: RuntimeContext): Promise<void> {
    ctx.addLog(this.name, 'Identificando ferramentas habilitadas e conectores MCP.');

    let parsedTools: string[] = [];
    if (ctx.agent.toolsConfig) {
      try {
        const obj = typeof ctx.agent.toolsConfig === 'string' ? JSON.parse(ctx.agent.toolsConfig) : ctx.agent.toolsConfig;
        parsedTools = obj.tools || [];
      } catch (err) {
        parsedTools = [];
      }
    }

    if (parsedTools.length > 0) {
      ctx.toolsExecuted = parsedTools;
      this.eventsEmitter.emit(RuntimeEventType.TOOL_EXECUTED, ctx, {
        tools: parsedTools,
      });

      ctx.addLog(this.name, `${parsedTools.length} ferramentas mapeadas para execução.`, { tools: parsedTools });
    } else {
      ctx.addLog(this.name, 'Nenhuma ferramenta configurada.');
    }
  }
}
