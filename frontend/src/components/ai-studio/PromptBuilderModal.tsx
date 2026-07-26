'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '../Button';
import { Input } from '../Input';
import { api } from '../../services/api';
import {
  X,
  Sparkles,
  Building,
  Target,
  Smile,
  ShieldAlert,
  Wrench,
  Ban,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Play,
  Copy,
  Send,
  RotateCcw,
  Bot,
} from 'lucide-react';

interface PromptBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (agentData: any) => Promise<void>;
}

export const PromptBuilderModal: React.FC<PromptBuilderModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [knowledgeBases, setKnowledgeBases] = useState<any[]>([]);

  // Estado do Formulário do Prompt Builder
  const [formData, setFormData] = useState({
    // Passo 1: Sobre a Empresa
    companyName: 'ConnectMax CRM IA',
    segment: 'SaaS / Tecnologia B2B',
    products: 'CRM Inteligente com Agentes de IA, WhatsApp API e Finanças',
    services: 'Onboarding, Consultoria Comercial e Integração MCP',
    targetAudience: 'Gestores de Vendas, PMEs e Equipes Comerciais',

    // Passo 2: Objetivo do Agente
    agentName: 'Assistente Comercial Inteligente',
    objective: 'Qualificar novos contatos, responder dúvidas sobre planos e agendar demonstrações.',

    // Passo 3: Personalidade
    personality: 'PROFESSIONAL',
    toneOfVoice: 'Profissional, empático, claro e consultivo',
    language: 'pt-BR',
    emoji: '🤖',
    creativity: 'BALANCED',
    temperature: 0.7,

    // Passo 4: Regras
    rules: [
      'Nunca inventar respostas ou informações técnicas.',
      'Sempre consultar a base de conhecimento oficial.',
      'Nunca prometer descontos não autorizados.',
      'Escalar para atendente humano quando o cliente exigir ou estiver insatisfeito.',
    ],
    customRules: '',

    // Passo 5: O que PODE fazer
    allowedActions: [
      'Consultar CRM',
      'Criar Lead',
      'Enviar WhatsApp',
      'Consultar Agenda',
      'Criar Reunião',
    ],

    // Passo 6: O que NÃO PODE fazer
    prohibitedActions: [
      'NÃO alterar preços da tabela oficial.',
      'NÃO cancelar assinaturas sem confirmação.',
      'NÃO fornecer dados pessoais de outros clientes (LGPD).',
    ],

    // Passo 7: Conhecimento
    knowledgeBaseIds: [] as string[],

    // Passo 8: Output Gerado
    generatedSystemPrompt: '',
    isEditedManually: false,
  });

  // Playground simulado dentro do builder
  const [showPlayground, setShowPlayground] = useState(false);
  const [playgroundMessages, setPlaygroundMessages] = useState<any[]>([]);
  const [playgroundInput, setPlaygroundInput] = useState('');

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setError('');
      setShowPlayground(false);
      fetchKnowledge();
    }
  }, [isOpen]);

  const fetchKnowledge = async () => {
    try {
      const res = await api.get('/ai-studio/knowledge');
      setKnowledgeBases(res.data || []);
    } catch (err) {
      console.error('Erro ao buscar bases para o Prompt Builder:', err);
    }
  };

  if (!isOpen) return null;

  // Função para chamar a API de montagem de prompt ou gerar localmente
  const generatePromptNow = async () => {
    try {
      const response = await api.post('/ai-studio/agents/prompts/build', {
        companyName: formData.companyName,
        segment: formData.segment,
        products: formData.products,
        services: formData.services,
        targetAudience: formData.targetAudience,
        objective: formData.objective,
        personality: formData.personality,
        toneOfVoice: formData.toneOfVoice,
        language: formData.language,
        emoji: formData.emoji,
        rules: formData.rules,
        customRules: formData.customRules,
        allowedActions: formData.allowedActions,
        prohibitedActions: formData.prohibitedActions,
      });

      setFormData((prev) => ({
        ...prev,
        generatedSystemPrompt: response.data.systemPrompt,
      }));
    } catch (err) {
      // Fallback local caso a chamada falhe
      const fallbackPrompt = `=====================================================
# IDENTIDADE DO AGENTE DE INTELIGÊNCIA ARTIFICIAL
=====================================================
Empresa: ${formData.companyName} (${formData.segment})
Avatar / Identificador: ${formData.emoji}
Estilo de Personalidade: ${formData.personality}
Tom de Voz: ${formData.toneOfVoice}

## CONTEXTO E PRODUTOS
- Produtos: ${formData.products}
- Serviços: ${formData.services}
- Público-Alvo: ${formData.targetAudience}

## OBJETIVO PRINCIPAL DO AGENTE
"${formData.objective}"

## REGRAS MANDATÓRIAS DE CONDUTA
${formData.rules.map((r, i) => `${i + 1}. ${r}`).join('\n')}
${formData.customRules ? `\n- ${formData.customRules}` : ''}

## FERRAMENTAS E CAPACIDADES HABILITADAS
${formData.allowedActions.map((a) => `- [HABILITADO] ${a}`).join('\n')}

## RESTRIÇÕES E PROIBIÇÕES EXPRESSAS
${formData.prohibitedActions.map((p) => `- [PROIBIDO] ${p}`).join('\n')}
=====================================================`;

      setFormData((prev) => ({
        ...prev,
        generatedSystemPrompt: fallbackPrompt,
      }));
    }
  };

  const handleNextStep = () => {
    setError('');
    if (currentStep === 1 && !formData.companyName.trim()) {
      setError('O nome da empresa é obrigatório.');
      return;
    }
    if (currentStep === 2 && !formData.objective.trim()) {
      setError('O objetivo do agente é obrigatório.');
      return;
    }

    if (currentStep === 7) {
      generatePromptNow();
    }

    if (currentStep < 8) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    setError('');
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        name: formData.agentName || `${formData.companyName} Assistant`,
        avatar: formData.emoji,
        emoji: formData.emoji,
        category: 'Personalizado',
        objective: formData.objective,
        personality: formData.personality,
        toneOfVoice: formData.toneOfVoice,
        language: formData.language,
        temperature: formData.temperature,
        systemPrompt: formData.generatedSystemPrompt,
        initialMessage: `Olá! Sou o assistente de IA da ${formData.companyName}. Como posso ajudar?`,
        toolsConfig: { tools: ['crm', 'whatsapp', 'calendar'] },
        knowledgeBaseIds: formData.knowledgeBaseIds.join(','),
        status: 'ACTIVE',
        isPublished: true,
      };

      await onSubmit(payload);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao salvar o agente de IA.');
    } finally {
      setLoading(false);
    }
  };

  const handleTestPromptMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playgroundInput.trim()) return;

    const userText = playgroundInput.trim();
    setPlaygroundInput('');

    setPlaygroundMessages((prev) => [
      ...prev,
      { sender: 'user', text: userText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    ]);

    setTimeout(() => {
      const reply = `[Resposta com base no Prompt Gerado]: Entendi sua solicitação sobre "${userText}". Como assistente da ${formData.companyName}, sigo o objetivo: "${formData.objective}" com o tom ${formData.toneOfVoice}.`;
      setPlaygroundMessages((prev) => [
        ...prev,
        { sender: 'agent', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      ]);
    }, 800);
  };

  const toggleRule = (ruleText: string) => {
    if (formData.rules.includes(ruleText)) {
      setFormData({ ...formData, rules: formData.rules.filter((r) => r !== ruleText) });
    } else {
      setFormData({ ...formData, rules: [...formData.rules, ruleText] });
    }
  };

  const toggleAllowed = (action: string) => {
    if (formData.allowedActions.includes(action)) {
      setFormData({ ...formData, allowedActions: formData.allowedActions.filter((a) => a !== action) });
    } else {
      setFormData({ ...formData, allowedActions: [...formData.allowedActions, action] });
    }
  };

  const toggleProhibited = (action: string) => {
    if (formData.prohibitedActions.includes(action)) {
      setFormData({ ...formData, prohibitedActions: formData.prohibitedActions.filter((a) => a !== action) });
    } else {
      setFormData({ ...formData, prohibitedActions: [...formData.prohibitedActions, action] });
    }
  };

  const stepsList = [
    { num: 1, label: 'Empresa', icon: Building },
    { num: 2, label: 'Objetivo', icon: Target },
    { num: 3, label: 'Tom', icon: Smile },
    { num: 4, label: 'Regras', icon: ShieldAlert },
    { num: 5, label: 'Pode Fazer', icon: Wrench },
    { num: 6, label: 'Não Pode', icon: Ban },
    { num: 7, label: 'Bases RAG', icon: BookOpen },
    { num: 8, label: 'Prompt Gerado', icon: Sparkles },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden border border-slate-200 my-6 flex flex-col max-h-[90vh]">
        {/* Header do Prompt Builder */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 text-white shadow-md">
              <Sparkles size={22} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Prompt Builder Inteligente — Gerador Declarativo
                <span className="text-[10px] font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30 px-2 py-0.5 rounded-full">
                  Etapa {currentStep} de 8
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Responda às perguntas e deixe a IA sintetizar o System Prompt completo.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={22} />
          </button>
        </div>

        {/* Indicador de Passos */}
        <div className="bg-slate-950 px-6 py-3 border-b border-slate-800 overflow-x-auto shrink-0">
          <div className="flex items-center justify-between min-w-[650px] gap-2">
            {stepsList.map((st) => {
              const Icon = st.icon;
              const isDone = currentStep > st.num;
              const isCurrent = currentStep === st.num;

              return (
                <button
                  key={st.num}
                  onClick={() => {
                    if (st.num < currentStep) setCurrentStep(st.num);
                  }}
                  disabled={st.num > currentStep}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isCurrent
                      ? 'bg-brand-500 text-white shadow-md shadow-brand-500/30'
                      : isDone
                      ? 'bg-slate-800 text-brand-400 hover:bg-slate-700'
                      : 'text-slate-500 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <Icon size={14} />
                  <span>{st.num}. {st.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mensagem de Erro */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 shrink-0">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* Conteúdo dos Passos */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs overflow-y-auto flex-1">
          {/* PASSO 1: Sobre a Empresa */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">Passo 1: Sobre a Empresa & Negócio</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Nome da Empresa *"
                  placeholder="Ex: ConnectMax CRM IA"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  required
                />
                <Input
                  label="Segmento de Atuação"
                  placeholder="Ex: Software SaaS / Tecnologia B2B"
                  value={formData.segment}
                  onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700 uppercase tracking-wider">
                  Principais Produtos
                </label>
                <textarea
                  rows={2}
                  placeholder="Descreva os produtos vendidos pela empresa..."
                  value={formData.products}
                  onChange={(e) => setFormData({ ...formData, products: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Serviços Prestados"
                  placeholder="Ex: Onboarding, Consultoria, Suporte"
                  value={formData.services}
                  onChange={(e) => setFormData({ ...formData, services: e.target.value })}
                />
                <Input
                  label="Público-Alvo / Perfil de Cliente"
                  placeholder="Ex: Gestores Comerciais, PMEs"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* PASSO 2: Objetivo do Agente */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">Passo 2: Nome e Objetivo Principal</h4>

              <Input
                label="Nome do Agente"
                placeholder="Ex: Assistente Comercial & SDR"
                value={formData.agentName}
                onChange={(e) => setFormData({ ...formData, agentName: e.target.value })}
              />

              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700 uppercase tracking-wider">
                  Qual é o Objetivo Principal deste Agente? *
                </label>
                <textarea
                  rows={4}
                  placeholder="Descreva o propósito principal..."
                  value={formData.objective}
                  onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  required
                />
              </div>

              {/* Botões Rápidos */}
              <div className="flex flex-wrap gap-2">
                {[
                  'Qualificar Leads e agendar reuniões',
                  'Atender dúvidas de suporte técnico',
                  'Lembrar parcelas e negociar pagamentos',
                  'Explicar os planos e preços da plataforma',
                ].map((obj) => (
                  <button
                    key={obj}
                    type="button"
                    onClick={() => setFormData({ ...formData, objective: obj })}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-brand-50 text-slate-700 text-xs transition-colors"
                  >
                    + {obj}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PASSO 3: Personalidade & Tom */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">Passo 3: Personalidade, Tom e Emoji</h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { key: 'FORMAL', label: 'Formal' },
                  { key: 'PROFESSIONAL', label: 'Profissional' },
                  { key: 'FRIENDLY', label: 'Amigável' },
                  { key: 'CONSULTATIVE', label: 'Consultivo' },
                  { key: 'TECHNICAL', label: 'Técnico' },
                  { key: 'HUMAN', label: 'Humano' },
                  { key: 'PREMIUM', label: 'Premium' },
                  { key: 'CUSTOM', label: 'Personalizado' },
                ].map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => setFormData({ ...formData, personality: p.key })}
                    className={`p-3 rounded-xl border text-center font-bold text-xs transition-all ${
                      formData.personality === p.key
                        ? 'border-brand-500 bg-brand-50 text-brand-900 ring-2 ring-brand-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Tom de Voz Detalhado"
                  placeholder="Ex: Cordial, paciente e objetivo"
                  value={formData.toneOfVoice}
                  onChange={(e) => setFormData({ ...formData, toneOfVoice: e.target.value })}
                />
                <Input
                  label="Emoji Identificador"
                  placeholder="Ex: 🤖, 💼, 🚀"
                  value={formData.emoji}
                  onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* PASSO 4: Regras de Conduta */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">Passo 4: Regras Mandatórias de Conduta</h4>

              <div className="space-y-2">
                {[
                  'Nunca inventar respostas ou informações técnicas.',
                  'Sempre consultar a base de conhecimento oficial.',
                  'Nunca prometer descontos não autorizados.',
                  'Escalar para atendente humano quando o cliente exigir ou estiver insatisfeito.',
                  'Manter sigilo total sobre os dados da empresa e clientes (LGPD).',
                ].map((rule) => {
                  const isChecked = formData.rules.includes(rule);
                  return (
                    <div
                      key={rule}
                      onClick={() => toggleRule(rule)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isChecked
                          ? 'border-brand-500 bg-brand-50 text-brand-900 font-semibold'
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      <span>{rule}</span>
                      <input type="checkbox" checked={isChecked} onChange={() => {}} className="h-4 w-4 text-brand-500 rounded" />
                    </div>
                  );
                })}
              </div>

              <Input
                label="Regra Adicional Personalizada"
                placeholder="Ex: Sempre finalizar o atendimento perguntando se há novas dúvidas."
                value={formData.customRules}
                onChange={(e) => setFormData({ ...formData, customRules: e.target.value })}
              />
            </div>
          )}

          {/* PASSO 5: O que PODE fazer */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">Passo 5: Ações Habilitadas (O que PODE fazer)</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  'Consultar CRM',
                  'Criar Lead',
                  'Atualizar Cliente',
                  'Enviar WhatsApp',
                  'Enviar Email',
                  'Criar Tarefa',
                  'Criar Reunião',
                  'Consultar Agenda',
                  'Consultar Financeiro',
                  'Executar Workflow',
                  'Utilizar MCP',
                ].map((action) => {
                  const isChecked = formData.allowedActions.includes(action);
                  return (
                    <div
                      key={action}
                      onClick={() => toggleAllowed(action)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isChecked
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold'
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      <span>+ {action}</span>
                      <input type="checkbox" checked={isChecked} onChange={() => {}} className="h-4 w-4 text-emerald-600 rounded" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PASSO 6: O que NÃO PODE fazer */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">Passo 6: Restrições Operacionais (O que NÃO PODE fazer)</h4>

              <div className="space-y-2">
                {[
                  'NÃO alterar preços da tabela oficial.',
                  'NÃO cancelar assinaturas sem confirmação.',
                  'NÃO fornecer dados pessoais de outros clientes (LGPD).',
                  'NÃO utilizar tom informal excessivo ou gírias.',
                ].map((action) => {
                  const isChecked = formData.prohibitedActions.includes(action);
                  return (
                    <div
                      key={action}
                      onClick={() => toggleProhibited(action)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isChecked
                          ? 'border-red-500 bg-red-50 text-red-900 font-semibold'
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      <span>🚫 {action}</span>
                      <input type="checkbox" checked={isChecked} onChange={() => {}} className="h-4 w-4 text-red-600 rounded" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PASSO 7: Bases RAG */}
          {currentStep === 7 && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">Passo 7: Bases de Conhecimento RAG</h4>

              {knowledgeBases.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Nenhuma base de conhecimento cadastrada na empresa.</p>
              ) : (
                <div className="space-y-2">
                  {knowledgeBases.map((kb) => {
                    const isSelected = formData.knowledgeBaseIds.includes(kb.id);
                    return (
                      <div
                        key={kb.id}
                        onClick={() => {
                          if (isSelected) {
                            setFormData({ ...formData, knowledgeBaseIds: formData.knowledgeBaseIds.filter((id) => id !== kb.id) });
                          } else {
                            setFormData({ ...formData, knowledgeBaseIds: [...formData.knowledgeBaseIds, kb.id] });
                          }
                        }}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer ${
                          isSelected ? 'border-brand-500 bg-brand-50 font-semibold text-brand-900' : 'border-slate-200 bg-white text-slate-700'
                        }`}
                      >
                        <span>{kb.name}</span>
                        <input type="checkbox" checked={isSelected} onChange={() => {}} className="h-4 w-4 text-brand-500 rounded" />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* PASSO 8: Prompt Gerado & Pré-visualização */}
          {currentStep === 8 && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-brand-50 border border-brand-200 text-brand-900 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm flex items-center gap-2">
                    <Sparkles className="text-brand-600" size={18} /> System Prompt Gerado com Sucesso!
                  </h4>
                  <p className="text-xs text-brand-700">
                    O prompt foi construído declarativamente. Você pode editar o texto antes de salvar.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  leftIcon={<Play size={14} />}
                  onClick={() => setShowPlayground(!showPlayground)}
                >
                  {showPlayground ? 'Ocultar Teste' : 'Testar Prompt'}
                </Button>
              </div>

              {/* Chat de Testes Simulado (Playground) */}
              {showPlayground && (
                <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-3">
                  <span className="text-xs font-bold text-brand-300 flex items-center gap-1">
                    <Bot size={14} /> Playground de Teste em Tempo Real
                  </span>
                  <div className="max-h-40 overflow-y-auto space-y-2 bg-slate-950 p-3 rounded-xl text-xs">
                    {playgroundMessages.map((m, i) => (
                      <div key={i} className={m.sender === 'user' ? 'text-right text-brand-300' : 'text-left text-slate-200'}>
                        <strong>{m.sender === 'user' ? 'Você' : 'Agente'}:</strong> {m.text}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Digite para testar a resposta..."
                      value={playgroundInput}
                      onChange={(e) => setPlaygroundInput(e.target.value)}
                      className="flex-1 rounded-xl bg-slate-800 border border-slate-700 p-2 text-xs text-white"
                    />
                    <button type="button" onClick={handleTestPromptMessage} className="px-3 py-1.5 bg-brand-500 rounded-xl text-xs font-bold">
                      Enviar
                    </button>
                  </div>
                </div>
              )}

              {/* Editor do System Prompt Gerado */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-900 text-xs uppercase tracking-wider">
                  System Prompt Compilado (Instrução Mestra)
                </label>
                <textarea
                  rows={10}
                  value={formData.generatedSystemPrompt}
                  onChange={(e) => setFormData({ ...formData, generatedSystemPrompt: e.target.value })}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-950 text-slate-100 p-4 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20 leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* Rodapé de Navegação */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between shrink-0">
            {currentStep > 1 ? (
              <Button type="button" variant="outline" size="sm" leftIcon={<ChevronLeft size={16} />} onClick={handlePrevStep}>
                Anterior
              </Button>
            ) : (
              <button type="button" onClick={onClose} className="text-xs font-semibold text-slate-500 hover:text-slate-800">
                Cancelar
              </button>
            )}

            {currentStep < 8 ? (
              <Button type="button" variant="primary" size="sm" rightIcon={<ChevronRight size={16} />} onClick={handleNextStep}>
                {currentStep === 7 ? 'Gerar Prompt' : 'Próximo'}
              </Button>
            ) : (
              <Button type="submit" variant="primary" isLoading={loading} rightIcon={<CheckCircle2 size={16} />}>
                Criar Agente com este Prompt
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
