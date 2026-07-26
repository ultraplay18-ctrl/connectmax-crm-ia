import { Injectable } from '@nestjs/common';
import { RuntimePipelineStep } from '../pipeline-step.interface';
import { RuntimeContext } from '../../context/runtime-context';
import { RuntimeEventsEmitter, RuntimeEventType } from '../../events/runtime-events.emitter';

import { MemoryCenterService } from '../../../memory-center/services/memory-center.service';

@Injectable()
export class MemoryStep implements RuntimePipelineStep {
  readonly name = 'MemoryStep';

  constructor(
    private readonly eventsEmitter: RuntimeEventsEmitter,
    private readonly memoryCenterService: MemoryCenterService,
  ) {}

  async execute(ctx: RuntimeContext): Promise<void> {
    ctx.addLog(this.name, 'Buscando histórico de memória da sessão e perfis no Memory Center.');

    if (ctx.agent.memoryEnabled) {
      // Integração com Memory Center
      const profiles = await this.memoryCenterService.getProfiles(ctx.companyId);
      const activeProfile = profiles?.[0];

      let memoryContext = ctx.systemPrompt;
      if (activeProfile) {
        memoryContext += `\n[Perfil do Cliente no Memory Center: ${activeProfile.customerName} | Preferências: ${activeProfile.preferences || 'Gerais'}]`;
      }

      ctx.history = [
        { role: 'system', content: memoryContext },
        { role: 'user', content: ctx.request.input },
      ];
      ctx.memoryLoaded = true;

      this.eventsEmitter.emit(RuntimeEventType.MEMORY_LOADED, ctx, {
        historyCount: ctx.history.length,
        profileLoaded: activeProfile?.customerName || null,
      });

      ctx.addLog(this.name, 'Memória do Memory Center ativada e histórico estendido carregado.');
    } else {
      ctx.history = [{ role: 'system', content: ctx.systemPrompt }, { role: 'user', content: ctx.request.input }];
      ctx.memoryLoaded = false;
      ctx.addLog(this.name, 'Memória desativada para este agente.');
    }
  }
}
