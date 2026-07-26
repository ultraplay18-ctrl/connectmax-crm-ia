import { Injectable } from '@nestjs/common';
import { RuntimePipelineStep } from '../pipeline-step.interface';
import { RuntimeContext } from '../../context/runtime-context';
import { RuntimeEventsEmitter, RuntimeEventType } from '../../events/runtime-events.emitter';

@Injectable()
export class KnowledgeStep implements RuntimePipelineStep {
  readonly name = 'KnowledgeStep';

  constructor(private readonly eventsEmitter: RuntimeEventsEmitter) {}

  async execute(ctx: RuntimeContext): Promise<void> {
    ctx.addLog(this.name, 'Consultando Bases de Conhecimento RAG.');

    if (ctx.agent.knowledgeBaseIds) {
      // Simulação de busca RAG semântica nos documentos da base
      const kbIds = ctx.agent.knowledgeBaseIds.split(',');
      ctx.knowledgeSnippets = [
        `Snippet RAG da Base [${kbIds[0]}]: Manual oficial do ConnectMax CRM IA v3.0.`,
      ];
      ctx.knowledgeLoaded = true;

      this.eventsEmitter.emit(RuntimeEventType.KNOWLEDGE_LOADED, ctx, {
        knowledgeBases: kbIds,
        snippetsFound: ctx.knowledgeSnippets.length,
      });

      ctx.addLog(this.name, `RAG executado com sucesso. ${ctx.knowledgeSnippets.length} trechos recuperados.`);
    } else {
      ctx.knowledgeLoaded = false;
      ctx.addLog(this.name, 'Nenhuma Base de Conhecimento vinculada ao agente.');
    }
  }
}
