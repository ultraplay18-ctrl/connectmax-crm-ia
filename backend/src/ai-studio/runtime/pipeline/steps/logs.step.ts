import { Injectable } from '@nestjs/common';
import { RuntimePipelineStep } from '../pipeline-step.interface';
import { RuntimeContext } from '../../context/runtime-context';
import { RuntimeLoggerService } from '../../logger/runtime-logger.service';

@Injectable()
export class LogsStep implements RuntimePipelineStep {
  readonly name = 'LogsStep';

  constructor(private readonly loggerService: RuntimeLoggerService) {}

  async execute(ctx: RuntimeContext): Promise<void> {
    ctx.addLog(this.name, 'Persistindo log de auditoria no banco de dados.');
    await this.loggerService.logExecution(ctx);
  }
}
