import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { RuntimePipelineStep } from '../pipeline-step.interface';
import { RuntimeContext } from '../../context/runtime-context';
import { PrismaService } from '../../../../database/prisma.service';

@Injectable()
export class ValidationStep implements RuntimePipelineStep {
  readonly name = 'ValidationStep';

  constructor(private readonly prisma: PrismaService) {}

  async execute(ctx: RuntimeContext): Promise<void> {
    ctx.addLog(this.name, 'Iniciando validação do Agente e Tenant.');

    if (!ctx.request.agentId) {
      throw new BadRequestException('ID do agente é obrigatório.');
    }

    if (!ctx.request.input?.trim()) {
      throw new BadRequestException('A mensagem de entrada não pode ser vazia.');
    }

    const agent = await this.prisma.aiAgent.findUnique({
      where: { id: ctx.request.agentId },
    });

    if (!agent) {
      throw new NotFoundException(`Agente com ID ${ctx.request.agentId} não encontrado.`);
    }

    if (agent.companyId !== ctx.companyId) {
      throw new BadRequestException('Agente pertence a outra empresa/tenant.');
    }

    if (agent.status !== 'ACTIVE') {
      throw new BadRequestException(`Agente está com status ${agent.status} (Inativo/Arquivado).`);
    }

    ctx.agent = agent;
    ctx.addLog(this.name, `Agente "${agent.name}" carregado e validado com sucesso.`, {
      provider: agent.provider,
      model: agent.modelName,
    });
  }
}
