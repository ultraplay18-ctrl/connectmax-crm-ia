import { Injectable, Logger } from '@nestjs/common';
import { RuntimePipelineStep } from './pipeline-step.interface';
import { RuntimeContext } from '../context/runtime-context';
import { ValidationStep } from './steps/validation.step';
import { ContextStep } from './steps/context.step';
import { MemoryStep } from './steps/memory.step';
import { KnowledgeStep } from './steps/knowledge.step';
import { ToolsStep } from './steps/tools.step';
import { ProviderStep } from './steps/provider.step';
import { ResponseStep } from './steps/response.step';
import { LogsStep } from './steps/logs.step';
import { AnalyticsStep } from './steps/analytics.step';

@Injectable()
export class RuntimePipeline {
  private readonly logger = new Logger(RuntimePipeline.name);
  private readonly steps: RuntimePipelineStep[];

  constructor(
    validationStep: ValidationStep,
    contextStep: ContextStep,
    memoryStep: MemoryStep,
    knowledgeStep: KnowledgeStep,
    toolsStep: ToolsStep,
    providerStep: ProviderStep,
    responseStep: ResponseStep,
    logsStep: LogsStep,
    analyticsStep: AnalyticsStep,
  ) {
    this.steps = [
      validationStep,
      contextStep,
      memoryStep,
      knowledgeStep,
      toolsStep,
      providerStep,
      responseStep,
      logsStep,
      analyticsStep,
    ];
  }

  public async executePipeline(ctx: RuntimeContext): Promise<void> {
    this.logger.log(`[Pipeline Started] ExecutionId: ${ctx.executionId}`);

    for (const step of this.steps) {
      try {
        ctx.addLog('PIPELINE_STEP_START', `Executando etapa: ${step.name}`);
        await step.execute(ctx);
      } catch (err: any) {
        this.logger.error(`[Pipeline Step Error] ${step.name}: ${err.message}`, err.stack);
        ctx.status = 'FAILED';
        ctx.error = err.message || 'Erro durante a execução do pipeline';
        ctx.addLog('PIPELINE_STEP_ERROR', `Falha na etapa ${step.name}: ${err.message}`);
        throw err;
      }
    }

    ctx.endTime = Date.now();
    this.logger.log(
      `[Pipeline Completed] ExecutionId: ${ctx.executionId} | Latência: ${ctx.getLatencyMs()}ms | Status: ${ctx.status}`,
    );
  }
}
