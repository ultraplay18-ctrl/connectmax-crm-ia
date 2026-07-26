import { Injectable } from '@nestjs/common';
import { ProviderAdapterInterface } from './provider-adapter.interface';
import { ExecutionContext } from '../interfaces/execution-context.interface';

@Injectable()
export class SimulatedProviderAdapter implements ProviderAdapterInterface {
  readonly providerName = 'SIMULATED_FACTORY';

  supports(providerName: string): boolean {
    return true; // Suporta todos os provedores via simulação determinística
  }

  async generateResponse(ctx: ExecutionContext): Promise<string> {
    const provider = ctx.provider || 'OpenAI';
    const model = ctx.modelName || 'gpt-4o';
    const agentName = ctx.agent?.name || 'Agente Inteligente';

    return (
      `[Resposta processada via AI Execution Engine | Provedor: ${provider} | Modelo: ${model}]\n\n` +
      `Olá! Como ${agentName}, analisei a sua mensagem "${ctx.input}".\n\n` +
      `📌 **Resumo do Contexto Orquestrado**:\n` +
      `- System Prompt: Ativo e compilado.\n` +
      `- Memory Center: ${ctx.memoryLoaded ? 'Perfis de clientes e conversas anteriores carregados com sucesso.' : 'Sem memória ativa.'}\n` +
      `- Knowledge Hub RAG: ${ctx.knowledgeLoaded ? 'Busca semântica realizada nas bibliotecas corporativas.' : 'Sem base de conhecimento vinculada.'}\n` +
      `- Ferramentas Resolvidas: ${ctx.toolsResolved?.join(', ') || 'Nenhuma'}.\n\n` +
      `Estou à disposição para dar prosseguimento ao atendimento!`
    );
  }
}
