'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';
import { AiStudioHeader } from '../../../../components/ai-studio/AiStudioHeader';
import { AiStudioNavigation } from '../../../../components/ai-studio/AiStudioNavigation';
import { AgentWizardModal } from '../../../../components/ai-studio/AgentWizardModal';
import { Button } from '../../../../components/Button';
import { Badge } from '../../../../components/Badge';
import { api } from '../../../../services/api';
import {
  Bot,
  Play,
  CheckCircle2,
  Edit,
  Power,
  Cpu,
  Wrench,
  Brain,
  BookOpen,
  History,
  Send,
  User,
  Clock,
  Sparkles,
  ArrowLeft,
  Zap,
  RotateCcw,
} from 'lucide-react';
import Link from 'next/link';

export default function AgentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const agentId = params.id as string;

  const [agent, setAgent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'versions' | 'playground'>('overview');

  // Modal Wizard
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  // Playground Chat State
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'agent'; text: string; time: string }>>([]);
  const [inputText, setInputText] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const fetchAgentDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/ai-studio/agents/${agentId}`);
      setAgent(response.data);

      // Mensagem inicial no Playground
      if (response.data?.initialMessage && messages.length === 0) {
        setMessages([
          {
            sender: 'agent',
            text: response.data.initialMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch (err) {
      console.error('Erro ao buscar detalhes do agente:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (agentId) {
      fetchAgentDetails();
    }
  }, [agentId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || chatLoading) return;

    const userMsg = inputText.trim();
    setInputText('');
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages((prev) => [...prev, { sender: 'user', text: userMsg, time: timeStr }]);
    setChatLoading(true);

    setTimeout(() => {
      const reply = `[${agent?.name || 'Agente IA'} - ${agent?.modelName || 'gpt-4o'}] Recebido: "${userMsg}". Resposta simulada conforme o objetivo: "${agent?.objective || 'Atendimento de qualidade'}" e tom ${agent?.personality || 'Profissional'}.`;
      setMessages((prev) => [
        ...prev,
        { sender: 'agent', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      ]);
      setChatLoading(false);
    }, 1000);
  };

  const handlePublish = async () => {
    try {
      await api.post(`/ai-studio/agents/${agentId}/publish`);
      fetchAgentDetails();
    } catch (err) {
      console.error('Erro ao publicar agente:', err);
    }
  };

  const handleSaveWizard = async (data: any) => {
    await api.patch(`/ai-studio/agents/${agentId}`, data);
    fetchAgentDetails();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="py-20 text-center text-slate-400 text-xs">Carregando detalhes do agente...</div>
      </DashboardLayout>
    );
  }

  if (!agent) {
    return (
      <DashboardLayout>
        <div className="py-20 text-center text-slate-600 text-sm">Agente de IA não encontrado.</div>
      </DashboardLayout>
    );
  }

  const parsedTools = agent.toolsConfig
    ? typeof agent.toolsConfig === 'string'
      ? JSON.parse(agent.toolsConfig).tools || []
      : agent.toolsConfig.tools || []
    : [];

  const parsedMemory = agent.memoryConfig
    ? typeof agent.memoryConfig === 'string'
      ? JSON.parse(agent.memoryConfig)
      : agent.memoryConfig
    : {};

  const promptVersions = agent.prompts?.[0]?.versions || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Voltar */}
        <Link href="/ai-studio/agents" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft size={16} /> Voltar para Lista de Agentes
        </Link>

        {/* Header Superior com Avatar, Status e Ações */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-3xl p-3.5 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
              {agent.avatar || agent.emoji || '🤖'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">{agent.name}</h1>
                <Badge variant={agent.status === 'ACTIVE' ? 'green' : 'slate'}>
                  {agent.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                </Badge>
                <span className="text-xs font-mono font-bold bg-brand-50 text-brand-600 px-2 py-0.5 rounded border border-brand-200">
                  v{agent.version || 1}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{agent.description || 'Sem descrição.'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" leftIcon={<Edit size={16} />} onClick={() => setIsWizardOpen(true)}>
              Editar no Wizard
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Play size={16} />}
              onClick={() => setActiveTab('playground')}
            >
              Testar Agente
            </Button>
            <Button variant="primary" size="sm" leftIcon={<CheckCircle2 size={16} />} onClick={handlePublish}>
              Publicar Versão
            </Button>
          </div>
        </div>

        {/* Sub-navegação em Abas do Agente */}
        <div className="flex border-b border-slate-200 bg-white px-4 rounded-xl shadow-sm space-x-1">
          {[
            { id: 'overview', label: 'Visão Geral & Métricas', icon: Bot },
            { id: 'versions', label: `Histórico de Versões (${promptVersions.length})`, icon: History },
            { id: 'playground', label: 'Playground de Teste', icon: Play },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-brand-500 text-brand-600 bg-brand-50/50'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Conteúdo Aba 1: Visão Geral & Métricas */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Card Objetivo & Prompt Atual */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="text-brand-500" size={18} /> Objetivo do Agente
                </h3>
                <p className="text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200 italic leading-relaxed">
                  "{agent.objective || 'Nenhum objetivo especificado.'}"
                </p>

                <h3 className="text-base font-bold text-slate-900 pt-2 flex items-center gap-2 border-t border-slate-100">
                  <Cpu className="text-indigo-500" size={18} /> System Prompt Atual (Instrução Mestra v{agent.version})
                </h3>
                <pre className="text-xs font-mono bg-slate-950 text-slate-200 p-4 rounded-xl overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {agent.systemPrompt || '// Nenhum system prompt configurado'}
                </pre>
              </div>

              {/* Ferramentas e Memória */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Wrench className="text-brand-500" size={16} /> Ferramentas Ativas ({parsedTools.length})
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {parsedTools.length === 0 ? (
                      <span className="text-xs text-slate-400 italic">Nenhuma ferramenta habilitada.</span>
                    ) : (
                      parsedTools.map((t: string) => (
                        <span key={t} className="px-2.5 py-1 rounded-lg bg-brand-50 text-brand-700 border border-brand-200 text-xs font-mono font-semibold">
                          {t.toUpperCase()}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Brain className="text-purple-500" size={16} /> Configurações de Memória
                  </h4>
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Memória Curta:</span>
                      <strong className={parsedMemory.shortTerm ? 'text-emerald-600' : 'text-slate-400'}>
                        {parsedMemory.shortTerm ? 'Ativa' : 'Inativa'}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Memória Longa:</span>
                      <strong className={parsedMemory.longTerm ? 'text-emerald-600' : 'text-slate-400'}>
                        {parsedMemory.longTerm ? 'Ativa' : 'Inativa'}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Resumo Automático:</span>
                      <strong className={parsedMemory.autoSummary ? 'text-emerald-600' : 'text-slate-400'}>
                        {parsedMemory.autoSummary ? 'Ativo' : 'Inativo'}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Painel Lateral: Métricas do Agente */}
            <div className="space-y-6">
              <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-400 flex items-center gap-1.5">
                  <Zap size={16} /> Desempenho e Consumo
                </span>

                <div className="space-y-3 text-xs pt-2">
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Provedor:</span>
                    <strong className="text-white font-bold">{agent.provider}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Modelo:</span>
                    <strong className="text-brand-300 font-mono">{agent.modelName}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Temperatura:</span>
                    <strong className="text-white font-mono">{agent.temperature}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Personalidade:</span>
                    <strong className="text-white">{agent.personality}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Tempo Médio Resposta:</span>
                    <strong className="text-emerald-400 font-mono">420 ms</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Responsável:</span>
                    <strong className="text-slate-200">{agent.responsible?.name || 'Administrador'}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Aba 2: Histórico de Versões */}
        {activeTab === 'versions' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <History className="text-brand-500" size={18} /> Versões do System Prompt
            </h3>

            {promptVersions.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Nenhuma versão registrada.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {promptVersions.map((ver: any) => (
                  <div key={ver.id} className="py-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full font-mono font-bold bg-brand-50 text-brand-700 border border-brand-200">
                          Versão v{ver.version}
                        </span>
                        <span className="text-slate-500">{ver.changelog || 'Sem changelog'}</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">
                        {new Date(ver.createdAt).toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <pre className="text-[11px] font-mono bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-800 whitespace-pre-wrap">
                      {ver.content}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Aba 3: Playground de Testes Simulado */}
        {activeTab === 'playground' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden flex flex-col h-[550px]">
            {/* Header do Chat */}
            <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-xl p-2 rounded-xl bg-brand-500 text-white">{agent.avatar || '🤖'}</div>
                <div>
                  <h4 className="font-bold text-sm text-white">{agent.name}</h4>
                  <span className="text-[10px] text-brand-300 font-mono">{agent.provider} ({agent.modelName})</span>
                </div>
              </div>
              <button onClick={() => setMessages([])} className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
                <RotateCcw size={14} /> Limpar Chat
              </button>
            </div>

            {/* Mensagens do Chat */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-md p-4 rounded-2xl text-xs leading-relaxed space-y-1 ${
                      msg.sender === 'user'
                        ? 'bg-brand-600 text-white rounded-br-none shadow-sm'
                        : 'bg-white text-slate-900 border border-slate-200/80 rounded-bl-none shadow-sm'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className={`text-[9px] block text-right font-mono ${msg.sender === 'user' ? 'text-brand-200' : 'text-slate-400'}`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 p-3 rounded-2xl text-xs text-slate-400 animate-pulse">
                    O agente está pensando...
                  </div>
                </div>
              )}
            </div>

            {/* Input do Chat */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200 flex items-center gap-3">
              <input
                type="text"
                placeholder={`Digite uma mensagem para testar ${agent.name}...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 rounded-xl border border-slate-300 p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
              <Button type="submit" variant="primary" isLoading={chatLoading} rightIcon={<Send size={16} />}>
                Enviar
              </Button>
            </form>
          </div>
        )}

        {/* Modal Wizard para Edição */}
        <AgentWizardModal
          isOpen={isWizardOpen}
          onClose={() => setIsWizardOpen(false)}
          onSubmit={handleSaveWizard}
          initialData={agent}
        />
      </div>
    </DashboardLayout>
  );
}
