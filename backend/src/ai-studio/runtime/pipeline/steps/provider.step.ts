import { Injectable } from '@nestjs/common';
import { RuntimePipelineStep } from '../pipeline-step.interface';
import { RuntimeContext } from '../../context/runtime-context';
import { AiProviderFactory } from '../../../providers/ai-provider.factory';
import { RuntimeEventsEmitter, RuntimeEventType } from '../../events/runtime-events.emitter';

@Injectable()
export class ProviderStep implements RuntimePipelineStep {
  readonly name = 'ProviderStep';

  constructor(
    private readonly providerFactory: AiProviderFactory,
    private readonly eventsEmitter: RuntimeEventsEmitter,
  ) {}

  async execute(ctx: RuntimeContext): Promise<void> {
    ctx.addLog(this.name, `Selecionando Provedor LLM: ${ctx.agent.provider} (${ctx.agent.modelName}).`);

    this.eventsEmitter.emit(RuntimeEventType.PROVIDER_CALLED, ctx, {
      provider: ctx.agent.provider,
      model: ctx.agent.modelName,
    });

    const providerInstance = this.providerFactory.getProvider(ctx.agent.provider);

    const completion = await providerInstance.generateCompletion({
      companyId: ctx.companyId,
      model: ctx.agent.modelName,
      prompt: ctx.request.input,
      systemPrompt: ctx.compiledPrompt,
      temperature: ctx.agent.temperature || 0.7,
      maxTokens: ctx.agent.maxTokens || 2048,
    });

    ctx.outputText = completion.content;
    ctx.promptTokens = completion.promptTokens;
    ctx.completionTokens = completion.completionTokens;
    ctx.totalTokens = completion.totalTokens;
    ctx.estimatedCostUsd = completion.costUsd || completion.totalTokens * 0.000002;

    ctx.addLog(this.name, 'Conclusão recebida com sucesso do Provedor LLM.', {
      tokens: ctx.totalTokens,
      cost: ctx.estimatedCostUsd,
    });
  }
}
