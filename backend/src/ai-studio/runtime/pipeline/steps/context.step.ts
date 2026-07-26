import { Injectable } from '@nestjs/common';
import { RuntimePipelineStep } from '../pipeline-step.interface';
import { RuntimeContext } from '../../context/runtime-context';

@Injectable()
export class ContextStep implements RuntimePipelineStep {
  readonly name = 'ContextStep';

  async execute(ctx: RuntimeContext): Promise<void> {
    ctx.addLog(this.name, 'Construindo o contexto do agente.');

    const agent = ctx.agent;
    let compiled = agent.systemPrompt || 'Você é um assistente virtual especialista de IA.';

    if (agent.personality) {
      compiled += `\n[Estilo de Personalidade: ${agent.personality}]`;
    }
    if (agent.toneOfVoice) {
      compiled += `\n[Tom de Voz: ${agent.toneOfVoice}]`;
    }
    if (agent.language) {
      compiled += `\n[Idioma: ${agent.language}]`;
    }

    ctx.systemPrompt = compiled;
    ctx.compiledPrompt = compiled;

    ctx.addLog(this.name, 'Contexto compilado com sucesso.');
  }
}
