import { Injectable } from '@nestjs/common';
import { RuntimePipelineStep } from '../pipeline-step.interface';
import { RuntimeContext } from '../../context/runtime-context';
import { RuntimeMetricsService } from '../../metrics/runtime-metrics.service';

@Injectable()
export class AnalyticsStep implements RuntimePipelineStep {
  readonly name = 'AnalyticsStep';

  constructor(private readonly metricsService: RuntimeMetricsService) {}

  async execute(ctx: RuntimeContext): Promise<void> {
    ctx.addLog(this.name, 'Persistindo métricas de consumo e telemetria.');
    await this.metricsService.recordMetrics(ctx);
  }
}
