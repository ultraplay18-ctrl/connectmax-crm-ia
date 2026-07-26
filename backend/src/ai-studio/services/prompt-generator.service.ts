import { Injectable } from '@nestjs/common';

export interface PromptBuildInputDto {
  companyName?: string;
  segment?: string;
  products?: string;
  services?: string;
  targetAudience?: string;
  objective?: string;
  personality?: string;
  toneOfVoice?: string;
  language?: string;
  emoji?: string;
  rules?: string[];
  customRules?: string;
  allowedActions?: string[];
  prohibitedActions?: string[];
  knowledgeBases?: string[];
}

export interface PromptBuildResponseDto {
  systemPrompt: string;
  operationalPrompt: string;
  rulesSection: string;
  prohibitionsSection: string;
  fullPrompt: string;
}

@Injectable()
export class PromptGeneratorService {
  generatePrompt(input: PromptBuildInputDto): PromptBuildResponseDto {
    const companyName = input.companyName || 'Nossa Empresa';
    const segment = input.segment || 'Tecnologia e Serviços';
    const objective = input.objective || 'Atendimento comercial e qualificação de leads';
    const personality = input.personality || 'PROFESSIONAL';
    const toneOfVoice = input.toneOfVoice || 'Profissional, empático e resolutivo';
    const language = input.language || 'pt-BR';
    const emoji = input.emoji || '🤖';

    // 1. Identidade e Contexto da Empresa
    const identityHeader = `=====================================================
# IDENTIDADE DO AGENTE DE INTELIGÊNCIA ARTIFICIAL
=====================================================
Você é um assistente virtual especialista de IA da empresa "${companyName}" (${segment}).
Avatar / Identificador Visual: ${emoji}
Idioma de Operação: ${language}
Estilo de Personalidade: ${personality}
Tom de Voz: ${toneOfVoice}
`;

    // 2. Sobre a Empresa e Ofertas
    let companySection = `\n## SOBRE A EMPRESA E CONTEXTO\n`;
    companySection += `- Empresa: ${companyName}\n`;
    companySection += `- Segmento: ${segment}\n`;
    if (input.products) companySection += `- Produtos: ${input.products}\n`;
    if (input.services) companySection += `- Serviços: ${input.services}\n`;
    if (input.targetAudience) companySection += `- Público-Alvo: ${input.targetAudience}\n`;

    // 3. Objetivo Operacional
    const objectiveSection = `\n## OBJETIVO PRINCIPAL DO AGENTE
O seu objetivo fundamental é:
"${objective}"
`;

    // 4. Regras Obrigatórias
    let rulesSection = `\n## REGRAS MANDATÓRIAS DE CONDUTA\n`;
    const defaultRules = [
      '1. Nunca invente dados ou prometa condições não autorizadas.',
      '2. Responda com base na base de conhecimento oficial e nas ferramentas disponíveis.',
      '3. Sempre trate o usuário com respeito, civilidade e cortesia.',
      '4. Quando a dúvida exceder o escopo da IA, informe que o atendimento será direcionado a um agente humano.',
    ];

    if (input.rules && input.rules.length > 0) {
      input.rules.forEach((r, idx) => {
        defaultRules.push(`${defaultRules.length + 1}. ${r}`);
      });
    }

    if (input.customRules) {
      defaultRules.push(`${defaultRules.length + 1}. ${input.customRules}`);
    }

    rulesSection += defaultRules.join('\n') + '\n';

    // 5. Capacidades (O que PODE fazer)
    let allowedSection = `\n## FERRAMENTAS E CAPACIDADES HABILITADAS\n`;
    if (input.allowedActions && input.allowedActions.length > 0) {
      allowedSection += input.allowedActions.map((act) => `- [HABILITADO] ${act}`).join('\n') + '\n';
    } else {
      allowedSection += `- [HABILITADO] Atendimento textual e consulta a produtos/serviços\n`;
    }

    // 6. Restrições (O que NÃO PODE fazer)
    let prohibitionsSection = `\n## RESTRIÇÕES E PROIBIÇÕES EXPRESSAS\n`;
    const defaultProhibitions = [
      '1. NÃO forneça pareceres financeiros, jurídicos ou médicos conclusivos.',
      '2. NÃO altere dados de cadastro ou valores de contratos diretamente sem confirmação do cliente.',
      '3. NÃO utilize linguagem ofensiva, informal excessiva ou girias inadequadas.',
    ];

    if (input.prohibitedActions && input.prohibitedActions.length > 0) {
      input.prohibitedActions.forEach((p, idx) => {
        defaultProhibitions.push(`${defaultProhibitions.length + 1}. ${p}`);
      });
    }

    prohibitionsSection += defaultProhibitions.join('\n') + '\n';

    // 7. Compilação do Prompt Completo
    const fullPrompt = `${identityHeader}${companySection}${objectiveSection}${rulesSection}${allowedSection}${prohibitionsSection}
=====================================================
# INSTRUÇÕES DE EXECUÇÃO
Saúde o usuário cordialmente no início da interação e conduza o atendimento focado em atingir o objetivo principal.
=====================================================`;

    return {
      systemPrompt: fullPrompt,
      operationalPrompt: `${identityHeader}${objectiveSection}`,
      rulesSection,
      prohibitionsSection,
      fullPrompt,
    };
  }
}
