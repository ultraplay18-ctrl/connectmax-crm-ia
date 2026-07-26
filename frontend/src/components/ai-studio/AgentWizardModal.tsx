'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '../Button';
import { Input } from '../Input';
import { api } from '../../services/api';
import {
  X,
  Bot,
  User,
  Building,
  Target,
  Sparkles,
  Sliders,
  Cpu,
  Wrench,
  Brain,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Smile,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface AgentWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (agentData: any) => Promise<void>;
  initialData?: any;
}

export const AgentWizardModal: React.FC<AgentWizardModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Listas de apoio
  const [users, setUsers] = useState<any[]>([]);
  const [knowledgeBases, setKnowledgeBases] = useState<any[]>([]);

  // Estado do formulário completo em 8 Passos
  const [formData, setFormData] = useState({
    name: '',
    avatar: '🤖',
    description: '',
    category: 'Vendas',
    responsibleId: '',
    objective: 'Qualificar Leads e agendar reuniões comerciais.',
    personality: 'PROFESSIONAL',
    toneOfVoice: 'Profissional, consultivo e objetivo',
    language: 'pt-BR',
    emoji: '🤖',
    creativity: 'BALANCED',
    temperature: 0.7,
    maxTokens: 2048,
    provider: 'OpenAI',
    modelName: 'gpt-4o',
    systemPrompt: 'Você é um assistente virtual especialista no produto ConnectMax CRM IA.',
    initialMessage: 'Olá! Como posso ajudar você e sua empresa hoje?',
    instructions: 'Atenda o cliente com cortesia, entenda a dor do lead e direcione para a melhor solução.',
    selectedTools: ['crm', 'whatsapp', 'calendar'],
    memoryConfig: {
      shortTerm: true,
      longTerm: true,
      autoSummary: true,
      history: true,
      contextWindow: 128000,
    },
    knowledgeBaseIds: [] as string[],
    status: 'ACTIVE',
    isPublished: true,
  });

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setError('');
      fetchSupportData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        avatar: initialData.avatar || initialData.emoji || '🤖',
        description: initialData.description || '',
        category: initialData.category || 'Vendas',
        responsibleId: initialData.responsibleId || '',
        objective: initialData.objective || 'Qualificar Leads e agendar reuniões comerciais.',
        personality: initialData.personality || 'PROFESSIONAL',
        toneOfVoice: initialData.toneOfVoice || 'Profissional, consultivo e objetivo',
        language: initialData.language || 'pt-BR',
        emoji: initialData.emoji || '🤖',
        creativity: initialData.creativity || 'BALANCED',
        temperature: initialData.temperature !== undefined ? initialData.temperature : 0.7,
        maxTokens: initialData.maxTokens || 2048,
        provider: initialData.provider || 'OpenAI',
        modelName: initialData.modelName || 'gpt-4o',
        systemPrompt: initialData.systemPrompt || '',
        initialMessage: initialData.initialMessage || 'Olá! Como posso ajudar você e sua empresa hoje?',
        instructions: initialData.instructions || '',
        selectedTools: initialData.toolsConfig ? (typeof initialData.toolsConfig === 'string' ? JSON.parse(initialData.toolsConfig).tools || [] : initialData.toolsConfig.tools || []) : ['crm', 'whatsapp', 'calendar'],
        memoryConfig: initialData.memoryConfig ? (typeof initialData.memoryConfig === 'string' ? JSON.parse(initialData.memoryConfig) : initialData.memoryConfig) : { shortTerm: true, longTerm: true, autoSummary: true, history: true, contextWindow: 128000 },
        knowledgeBaseIds: initialData.knowledgeBaseIds ? initialData.knowledgeBaseIds.split(',') : [],
        status: initialData.status || 'ACTIVE',
        isPublished: initialData.isPublished !== undefined ? initialData.isPublished : true,
      });
    }
  }, [initialData, isOpen]);

  const fetchSupportData = async () => {
    try {
      const [usersRes, kbRes] = await Promise.all([
        api.get('/users'),
        api.get('/ai-studio/knowledge'),
      ]);
      setUsers(usersRes.data || []);
      setKnowledgeBases(kbRes.data || []);
    } catch (err) {
      console.error('Erro ao buscar dados de apoio para o Wizard:', err);
    }
  };

  if (!isOpen) return null;

  const handleNextStep = () => {
    setError('');
    if (currentStep === 1 && !formData.name.trim()) {
      setError('O nome do agente é obrigatório.');
      return;
    }
    if (currentStep === 2 && !formData.objective.trim()) {
      setError('O objetivo do agente é obrigatório.');
      return;
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
        ...formData,
        emoji: formData.avatar,
        toolsConfig: { tools: formData.selectedTools },
        knowledgeBaseIds: formData.knowledgeBaseIds.join(','),
      };
      await onSubmit(payload);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao salvar o agente de IA.');
    } finally {
      setLoading(false);
    }
  };

  const toggleTool = (toolSlug: string) => {
    if (formData.selectedTools.includes(toolSlug)) {
      setFormData({
        ...formData,
        selectedTools: formData.selectedTools.filter((t) => t !== toolSlug),
      });
    } else {
      setFormData({
        ...formData,
        selectedTools: [...formData.selectedTools, toolSlug],
      });
    }
  };

  const toggleKb = (kbId: string) => {
    if (formData.knowledgeBaseIds.includes(kbId)) {
      setFormData({
        ...formData,
        knowledgeBaseIds: formData.knowledgeBaseIds.filter((id) => id !== kbId),
      });
    } else {
      setFormData({
        ...formData,
        knowledgeBaseIds: [...formData.knowledgeBaseIds, kbId],
      });
    }
  };

  const emojisList = ['🤖', '💼', '🚀', '🎯', '💡', '💬', '📞', '⚙️', '🛡️', '📊', '🌐', '🧠'];

  const stepsList = [
    { num: 1, label: 'Básico', icon: Bot },
    { num: 2, label: 'Objetivo', icon: Target },
    { num: 3, label: 'Personalidade', icon: Smile },
    { num: 4, label: 'Modelo', icon: Cpu },
    { num: 5, label: 'Ferramentas', icon: Wrench },
    { num: 6, label: 'Memória', icon: Brain },
    { num: 7, label: 'Conhecimento', icon: BookOpen },
    { num: 8, label: 'Revisão', icon: CheckCircle2 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden border border-slate-200/80 my-6 flex flex-col max-h-[90vh]">
        {/* Header do Wizard */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 text-white shadow-md shadow-brand-500/20">
              <Bot size={22} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                {initialData ? 'Editar Agente de IA' : 'Criador de Agentes — Wizard em 8 Passos'}
                <span className="text-[10px] font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30 px-2 py-0.5 rounded-full">
                  Passo {currentStep} de 8
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Configure a inteligência, tom, modelo, ferramentas e conhecimento do assistente.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={22} />
          </button>
        </div>

        {/* Indicador de Progresso dos 8 Passos */}
        <div className="bg-slate-950 px-6 py-3 border-b border-slate-800 overflow-x-auto shrink-0">
          <div className="flex items-center justify-between min-w-[600px] gap-2">
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
          {/* PASSO 1: Informações Básicas */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-brand-50/50 border border-brand-100 text-brand-900">
                <Sparkles className="text-brand-500 shrink-0" size={20} />
                <p className="text-xs">
                  Defina o nome, emoji de identificação e o responsável por gerenciar este agente.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                <div className="sm:col-span-3">
                  <Input
                    label="Nome do Agente *"
                    placeholder="Ex: Agente Comercial & SDR"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider">
                    Avatar / Emoji
                  </label>
                  <div className="flex items-center gap-2">
                    <select
                      value={formData.avatar}
                      onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-base text-center focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    >
                      {emojisList.map((e) => (
                        <option key={e} value={e}>
                          {e}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700 uppercase tracking-wider">
                  Descrição do Agente
                </label>
                <textarea
                  rows={2}
                  placeholder="Resuma brevemente a função deste assistente..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider">
                    Categoria
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  >
                    <option value="Vendas">Vendas & SDR</option>
                    <option value="Suporte">Suporte Técnico</option>
                    <option value="Financeiro">Financeiro & Cobrança</option>
                    <option value="RH">RH & Onboarding</option>
                    <option value="Marketing">Marketing & Leads</option>
                    <option value="Cobrança">Cobrança Ativa</option>
                    <option value="Personalizado">Personalizado</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider">
                    Responsável na Empresa
                  </label>
                  <select
                    value={formData.responsibleId}
                    onChange={(e) => setFormData({ ...formData, responsibleId: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  >
                    <option value="">Nenhum (Administrador Padrão)</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.email})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* PASSO 2: Objetivo do Agente */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-900 text-sm">
                  O que este agente deve fazer? (Objetivo Principal) *
                </label>
                <p className="text-xs text-slate-500">
                  Descreva em detalhes o propósito, fluxo e metas das interações.
                </p>
                <textarea
                  rows={4}
                  placeholder="Ex: Meu agente deve saudar o cliente, identificar o orçamento disponível, qualificar as dores principais e agendar uma demonstração no calendário do vendedor responsável."
                  value={formData.objective}
                  onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 leading-relaxed font-sans"
                  required
                />
              </div>

              {/* Sugestões Rápidas de Objetivos */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-600 block">Exemplos Prontos de Objetivos:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { label: '🎯 Qualificar Leads', text: 'Abordar clientes novos, qualificar orçamento e interesse no produto SaaS.' },
                    { label: '🎧 Atender Clientes', text: 'Prestar suporte aos usuários da empresa, tirar dúvidas e abrir tickets.' },
                    { label: '💰 Cobrar Pagamentos', text: 'Lembrar clientes sobre parcelas vincendas e oferecer facilidades de pagamento.' },
                    { label: '📅 Marcar Reuniões', text: 'Verificar agenda dos consultores e marcar horários de demonstração.' },
                  ].map((tpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, objective: tpl.text })}
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-brand-50 hover:border-brand-300 text-left transition-colors group"
                    >
                      <span className="font-bold text-slate-900 group-hover:text-brand-600 block text-xs">{tpl.label}</span>
                      <span className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{tpl.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PASSO 3: Personalidade */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Estilo de Personalidade
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { key: 'FORMAL', label: 'Formal', desc: 'Sério e corporativo' },
                    { key: 'PROFESSIONAL', label: 'Profissional', desc: 'Claro e eficiente' },
                    { key: 'FRIENDLY', label: 'Amigável', desc: 'Empático e acolhedor' },
                    { key: 'CONSULTATIVE', label: 'Consultivo', desc: 'Especialista e orientador' },
                    { key: 'TECHNICAL', label: 'Técnico', desc: 'Direto e detalhista' },
                    { key: 'CUSTOM', label: 'Personalizado', desc: 'Definido manualmente' },
                  ].map((p) => (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => setFormData({ ...formData, personality: p.key })}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        formData.personality === p.key
                          ? 'border-brand-500 bg-brand-50 text-brand-900 ring-2 ring-brand-500/20'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <span className="font-bold block text-xs">{p.label}</span>
                      <span className="text-[10px] text-slate-500">{p.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Tom de Voz Especificado"
                  placeholder="Ex: Cordial, paciente e sem jargões complexos"
                  value={formData.toneOfVoice}
                  onChange={(e) => setFormData({ ...formData, toneOfVoice: e.target.value })}
                />

                <div className="space-y-1.5">
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider">
                    Idioma Principal
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  >
                    <option value="pt-BR">Português (Brasil)</option>
                    <option value="en-US">Inglês (US)</option>
                    <option value="es-ES">Espanhol</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <label className="font-semibold text-slate-700 uppercase tracking-wider">
                    Temperatura ({formData.temperature})
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {formData.temperature < 0.4 ? 'Mais Analítico / Estável' : formData.temperature > 0.8 ? 'Mais Criativo / Livre' : 'Balanceado'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-500"
                />
              </div>
            </div>
          )}

          {/* PASSO 4: Modelo (Provider Architecture) */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Provedor de Inteligência Artificial
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { key: 'OpenAI', label: 'OpenAI', desc: 'GPT-4o, o3' },
                    { key: 'Anthropic', label: 'Claude', desc: '3.5 Sonnet' },
                    { key: 'Google', label: 'Gemini', desc: '1.5 Pro' },
                    { key: 'DeepSeek', label: 'DeepSeek', desc: 'V3 & R1' },
                    { key: 'xAI', label: 'xAI Grok', desc: 'Grok 2' },
                    { key: 'Ollama', label: 'Ollama', desc: 'Local' },
                    { key: 'OpenRouter', label: 'OpenRouter', desc: 'Gateway' },
                  ].map((prov) => (
                    <button
                      key={prov.key}
                      type="button"
                      onClick={() => setFormData({ ...formData, provider: prov.key })}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        formData.provider === prov.key
                          ? 'border-brand-500 bg-brand-50 text-brand-900 ring-2 ring-brand-500/20'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <span className="font-bold block text-xs">{prov.label}</span>
                      <span className="text-[10px] text-slate-500">{prov.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700 uppercase tracking-wider">
                  Modelo Específico
                </label>
                <select
                  value={formData.modelName}
                  onChange={(e) => setFormData({ ...formData, modelName: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                >
                  <option value="gpt-4o">GPT-4o (Recomendado - Multimodal & Rápido)</option>
                  <option value="gpt-4o-mini">GPT-4o Mini (Econômico)</option>
                  <option value="claude-3-5-sonnet">Claude 3.5 Sonnet (Análise profunda & Código)</option>
                  <option value="gemini-1-5-pro">Gemini 1.5 Pro (Contexto 2M Tokens)</option>
                  <option value="deepseek-v3">DeepSeek V3 (Baixo Custo & Alta Lógica)</option>
                  <option value="grok-2">Grok 2 (Raciocínio Crítico)</option>
                  <option value="llama3-local">Llama 3.3 (Ollama Local Privado)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700 uppercase tracking-wider">
                  Instrução Mestra (System Prompt)
                </label>
                <textarea
                  rows={3}
                  placeholder="Defina o prompt de sistema do agente..."
                  value={formData.systemPrompt}
                  onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
            </div>
          )}

          {/* PASSO 5: Ferramentas */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="block font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Ferramentas Habilitadas para o Agente
                </label>
                <p className="text-xs text-slate-500">
                  Selecione quais capacidades e conectores MCP o assistente poderá invocar.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { slug: 'crm', name: 'CRM Tool', desc: 'Acessa leads e contatos' },
                  { slug: 'financial', name: 'Financeiro Tool', desc: 'Consulta contas e faturas' },
                  { slug: 'calendar', name: 'Agenda Tool', desc: 'Verifica horários e reuniões' },
                  { slug: 'whatsapp', name: 'WhatsApp Tool', desc: 'Envia e responde conversas' },
                  { slug: 'email', name: 'Email Tool', desc: 'Dispara e-mails transacionais' },
                  { slug: 'database', name: 'Database Tool', desc: 'Consulta dados da empresa' },
                  { slug: 'webhook', name: 'Webhook Tool', desc: 'Envia eventos HTTP POST' },
                  { slug: 'api', name: 'API REST Tool', desc: 'Chama APIs externas' },
                  { slug: 'mcp', name: 'Arquitetura MCP', desc: 'Conecta servidores MCP' },
                ].map((tool) => {
                  const isChecked = formData.selectedTools.includes(tool.slug);

                  return (
                    <button
                      key={tool.slug}
                      type="button"
                      onClick={() => toggleTool(tool.slug)}
                      className={`p-3 rounded-xl border text-left flex items-start justify-between transition-all ${
                        isChecked
                          ? 'border-brand-500 bg-brand-50 text-brand-900 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div>
                        <span className="font-bold block text-xs">{tool.name}</span>
                        <span className="text-[10px] text-slate-500">{tool.desc}</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="h-4 w-4 rounded border-slate-300 text-brand-500 focus:ring-brand-500 cursor-pointer mt-0.5"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* PASSO 6: Memória */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="block font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Configuração de Memória & Contexto
                </label>
                <p className="text-xs text-slate-500">
                  Gerencie como o agente retém o histórico e contexto do cliente.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { key: 'shortTerm', title: 'Memória Curta (Sessão)', desc: 'Retém dados da conversa atual durante a sessão ativa.' },
                  { key: 'longTerm', title: 'Memória Longa (Cross-Session)', desc: 'Lembra preferências e histórico de atendimentos anteriores.' },
                  { key: 'autoSummary', title: 'Resumo Automático de Contexto', desc: 'Comprime conversas longas em resumos semânticos para economizar tokens.' },
                  { key: 'history', title: 'Histórico Completo de Interações', desc: 'Grava log de mensagens para auditoria.' },
                ].map((item) => {
                  const isChecked = (formData.memoryConfig as any)[item.key];

                  return (
                    <div
                      key={item.key}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">{item.title}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            memoryConfig: { ...formData.memoryConfig, [item.key]: e.target.checked },
                          })
                        }
                        className="h-5 w-5 rounded border-slate-300 text-brand-500 focus:ring-brand-500 cursor-pointer"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PASSO 7: Base de Conhecimento */}
          {currentStep === 7 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="block font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Bases de Conhecimento Associadas (RAG)
                </label>
                <p className="text-xs text-slate-500">
                  Vincule bases de documentos (PDFs, DOCX, FAQs e Sites) ao agente.
                </p>
              </div>

              {knowledgeBases.length === 0 ? (
                <div className="p-6 rounded-xl border border-dashed border-slate-300 text-center text-xs text-slate-500 space-y-2">
                  <BookOpen size={24} className="mx-auto text-slate-400" />
                  <p>Nenhuma Base de Conhecimento cadastrada na empresa.</p>
                  <p className="text-[11px]">Você poderá cadastrar bases a qualquer momento no menu Base de Conhecimento.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {knowledgeBases.map((kb) => {
                    const isSelected = formData.knowledgeBaseIds.includes(kb.id);

                    return (
                      <div
                        key={kb.id}
                        onClick={() => toggleKb(kb.id)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'border-brand-500 bg-brand-50 text-brand-900 font-semibold'
                            : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <BookOpen size={16} className="text-brand-500" />
                          <span>{kb.name}</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="h-4 w-4 rounded border-slate-300 text-brand-500 focus:ring-brand-500"
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* PASSO 8: Revisão Final */}
          {currentStep === 8 && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
                <h4 className="font-bold text-sm flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-600" /> Tudo Pronto para Criar o Agente!
                </h4>
                <p className="text-xs text-emerald-700">
                  Revise o resumo das configurações antes de publicar o assistente.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2 border-b border-slate-200 pb-2">
                  <div>
                    <span className="text-slate-400 block">Agente & Emoji:</span>
                    <strong className="text-slate-900 font-bold">{formData.avatar} {formData.name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Categoria:</span>
                    <strong className="text-slate-900">{formData.category}</strong>
                  </div>
                </div>

                <div className="border-b border-slate-200 pb-2">
                  <span className="text-slate-400 block">Objetivo:</span>
                  <p className="text-slate-800 italic line-clamp-2">{formData.objective}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 border-b border-slate-200 pb-2">
                  <div>
                    <span className="text-slate-400 block">Modelo LLM:</span>
                    <strong className="text-slate-900 font-mono">{formData.provider} ({formData.modelName})</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Personalidade:</span>
                    <strong className="text-slate-900">{formData.personality}</strong>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block">Ferramentas Habilitadas:</span>
                  <span className="text-brand-600 font-mono font-semibold">
                    {formData.selectedTools.join(', ') || 'Nenhuma'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Rodapé de Navegação do Wizard */}
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
                Próximo
              </Button>
            ) : (
              <Button type="submit" variant="primary" isLoading={loading} rightIcon={<CheckCircle2 size={16} />}>
                {initialData ? 'Salvar Alterações' : 'Criar Agente Inteligente'}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
