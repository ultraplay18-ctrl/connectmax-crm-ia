import { Injectable } from '@nestjs/common';
import { RuntimePipelineStep } from '../pipeline-step.interface';
import { RuntimeContext } from '../../context/runtime-context';

@Injectable()
export class ResponseStep implements RuntimePipelineStep {
  readonly name = 'ResponseStep';

  async execute(ctx: RuntimeContext): Promise<void> {
    ctx.addLog(this.name, 'Formatando payload de resposta final.');

    if (!ctx.outputText) {
      ctx.outputText = 'Nenhuma resposta gerada pelo agente.';
    }

    ctx.addLog(this.name, 'Payload formatado com sucesso.');
  }
}
