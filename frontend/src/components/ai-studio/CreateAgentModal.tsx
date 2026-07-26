'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '../Button';
import { Input } from '../Input';
import {
  X,
  Bot,
  Cpu,
  Sliders,
  FileText,
  Wrench,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Zap,
} from 'lucide-react';

interface CreateAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (agentData: any) => Promise<void>;
  initialData?: any;
}

export const CreateAgentModal: React.FC<CreateAgentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [activeTab, setActiveTab] = useState<'geral' | 'modelo' | 'prompt' | 'capacidades'>('geral');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Vendas',
    provider: 'OpenAI',
    modelName: 'gpt-4o',
    temperature: 0.7,
    maxTokens: 2048,
    initialMessage: 'Olá! Como posso ajudar você hoje?',
    systemPrompt: 'Você é um assistente virtual especialista de IA da empresa no ConnectMax CRM.',
    objective: 'Auxiliar no atendimento e qualificação de clientes.',
    instructions: 'Responda com tom profissional, claro e objetivo.',
    language: 'pt-BR',
    creativity: 'BALANCED',
    memoryEnabled: true,
    status: 'ACTIVE',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        category: initialData.category || 'Vendas',
        provider: initialData.provider || 'OpenAI',
        modelName: initialData.modelName || 'gpt-4o',
        temperature: initialData.temperature !== undefined ? initialData.temperature : 0.7,
        maxTokens: initialData.maxTokens || 2048,
        initialMessage: initialData.initialMessage || '',
        systemPrompt: initialData.systemPrompt || '',
        objective: initialData.objective || '',
        instructions: initialData.instructions || '',
        language: initialData.language || 'pt-BR',
        creativity: initialData.creativity || 'BALANCED',
        memoryEnabled: initialData.memoryEnabled !== undefined ? initialData.memoryEnabled : true,
        status: initialData.status || 'ACTIVE',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        category: 'Vendas',
        provider: 'OpenAI',
        modelName: 'gpt-4o',
        temperature: 0.7,
        maxTokens: 2048,
        initialMessage: 'Olá! Como posso ajudar você hoje?',
        systemPrompt: 'Você é um assistente virtual especialista de IA da empresa no ConnectMax CRM.',
        objective: 'Auxiliar no atendimento e qualificação de clientes.',
        instructions: 'Responda com tom profissional, claro e objetivo.',
        language: 'pt-BR',
        creativity: 'BALANCED',
        memoryEnabled: true,
        status: 'ACTIVE',
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('O nome do agente é obrigatório.');
      setActiveTab('geral');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao salvar o agente de IA.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 my-8">
        {/* Header do Modal */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-brand-500 text-white">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold">
                {initialData ? 'Editar Agente de IA' : 'Criar Novo Agente de IA'}
              </h3>
              <p className="text-xs text-slate-400">
                Configure os parâmetros, modelo e comportamento do seu assistente.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Sub-navegação interna em abas */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2">
          {[
            { id: 'geral', label: '1. Geral', icon: Bot },
            { id: 'modelo', label: '2. Modelo & Parâmetros', icon: Cpu },
            { id: 'prompt', label: '3. Prompt & Instruções', icon: FileText },
            { id: 'capacidades', label: '4. Memória & Status', icon: Sliders },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-brand-500 text-brand-600 bg-white rounded-t-lg'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Mensagem de Erro */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          {/* Aba 1: Geral */}
          {activeTab === 'geral' && (
            <div className="space-y-4">
              <Input
                label="Nome do Agente *"
                placeholder="Ex: Agente de Vendas SaaS"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700 uppercase tracking-wider">
                  Descrição
                </label>
                <textarea
                  rows={2}
                  placeholder="Descreva o propósito deste agente..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
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
                    className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  >
                    <option value="Vendas">Vendas</option>
                    <option value="Suporte">Suporte</option>
                    <option value="Financeiro">Financeiro</option>
                    <option value="RH">RH</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Cobrança">Cobrança</option>
                    <option value="Personalizado">Personalizado</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider">
                    Idioma
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  >
                    <option value="pt-BR">Português (Brasil)</option>
                    <option value="en-US">Inglês (US)</option>
                    <option value="es-ES">Espanhol</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Aba 2: Modelo & Parâmetros */}
          {activeTab === 'modelo' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider">
                    Provedor de IA
                  </label>
                  <select
                    value={formData.provider}
                    onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  >
                    <option value="OpenAI">OpenAI</option>
                    <option value="Anthropic">Anthropic (Claude)</option>
                    <option value="Google">Google (Gemini)</option>
                    <option value="DeepSeek">DeepSeek</option>
                    <option value="xAI">xAI (Grok)</option>
                    <option value="Ollama">Ollama (Modelo Local)</option>
                    <option value="OpenRouter">OpenRouter</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider">
                    Modelo de LLM
                  </label>
                  <select
                    value={formData.modelName}
                    onChange={(e) => setFormData({ ...formData, modelName: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  >
                    <option value="gpt-4o">GPT-4o (Recomendado)</option>
                    <option value="gpt-4o-mini">GPT-4o Mini</option>
                    <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
                    <option value="gemini-1-5-pro">Gemini 1.5 Pro</option>
                    <option value="deepseek-v3">DeepSeek V3</option>
                    <option value="grok-2">Grok 2</option>
                    <option value="llama3-local">Llama 3.3 (Local)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-semibold text-slate-700 uppercase tracking-wider">
                    Temperatura ({formData.temperature})
                  </label>
                  <span className="text-[10px] text-slate-500">
                    {formData.temperature < 0.4 ? 'Mais Preciso' : formData.temperature > 0.8 ? 'Mais Criativo' : 'Balanceado'}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Máximo de Tokens"
                  type="number"
                  value={formData.maxTokens}
                  onChange={(e) => setFormData({ ...formData, maxTokens: parseInt(e.target.value) || 2048 })}
                />

                <div className="space-y-1.5">
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider">
                    Criatividade
                  </label>
                  <select
                    value={formData.creativity}
                    onChange={(e) => setFormData({ ...formData, creativity: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  >
                    <option value="PRECISE">Preciso / Analítico</option>
                    <option value="BALANCED">Balanceado</option>
                    <option value="CREATIVE">Criativo / Persuasivo</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Aba 3: Prompt & Instruções */}
          {activeTab === 'prompt' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700 uppercase tracking-wider">
                  Mensagem Inicial
                </label>
                <input
                  type="text"
                  placeholder="Primeira mensagem que o agente enviará ao cliente..."
                  value={formData.initialMessage}
                  onChange={(e) => setFormData({ ...formData, initialMessage: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700 uppercase tracking-wider">
                  System Prompt (Instrução Mestra)
                </label>
                <textarea
                  rows={4}
                  placeholder="Defina a identidade e persona do agente..."
                  value={formData.systemPrompt}
                  onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700 uppercase tracking-wider">
                  Instruções Específicas
                </label>
                <textarea
                  rows={3}
                  placeholder="Regras de conduta, tom de voz, o que fazer e o que não fazer..."
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
            </div>
          )}

          {/* Aba 4: Capacidades & Memória */}
          {activeTab === 'capacidades' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900">Memória de Curto & Longo Prazo</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Permite ao agente lembrar histórico de conversas anteriores com o cliente.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.memoryEnabled}
                  onChange={(e) => setFormData({ ...formData, memoryEnabled: e.target.checked })}
                  className="h-5 w-5 rounded border-slate-300 text-brand-500 focus:ring-brand-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700 uppercase tracking-wider">
                  Status do Agente
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                >
                  <option value="ACTIVE">Ativo (Pronto para Uso)</option>
                  <option value="INACTIVE">Inativo (Pausado)</option>
                </select>
              </div>
            </div>
          )}

          {/* Rodapé e Botões */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancelar
            </button>

            <div className="flex items-center gap-2">
              {activeTab !== 'capacidades' ? (
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => {
                    if (activeTab === 'geral') setActiveTab('modelo');
                    else if (activeTab === 'modelo') setActiveTab('prompt');
                    else if (activeTab === 'prompt') setActiveTab('capacidades');
                  }}
                >
                  Próximo
                </Button>
              ) : (
                <Button type="submit" variant="primary" isLoading={loading} rightIcon={<CheckCircle2 size={16} />}>
                  {initialData ? 'Salvar Alterações' : 'Criar Agente'}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
