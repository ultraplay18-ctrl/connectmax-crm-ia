'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { AiStudioHeader } from '../../components/ai-studio/AiStudioHeader';
import { AiStudioNavigation } from '../../components/ai-studio/AiStudioNavigation';
import { StatsCard } from '../../components/StatsCard';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { api } from '../../services/api';
import {
  Bot,
  Zap,
  Play,
  Coins,
  Plus,
  ArrowRight,
  Sparkles,
  Layers,
  Cpu,
  Clock,
  Activity,
} from 'lucide-react';
import Link from 'next/link';

export default function AiStudioDashboardPage() {
  const [metrics, setMetrics] = useState({
    totalAgents: 0,
    activeAgents: 0,
    totalExecutions: 0,
    totalTokens: 0,
    totalCost: 0,
    recentExecutions: [] as any[],
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/ai-studio/dashboard');
      setMetrics(response.data);
    } catch (err) {
      console.error('Erro ao buscar métricas do AI Studio:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header do AI Studio */}
        <AiStudioHeader
          title="Central de Inteligência Artificial"
          subtitle="Crie, configure e monitore os Agentes de IA da sua empresa."
          activeTab="Dashboard IA"
          action={
            <Link href="/ai-studio/agents">
              <Button variant="primary" leftIcon={<Plus size={18} />}>
                Novo Agente
              </Button>
            </Link>
          }
        />

        {/* Sub-navegação em Abas */}
        <AiStudioNavigation />

        {/* Cards de Métricas Principais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total de Agentes"
            value={loading ? '...' : metrics.totalAgents}
            trend={`${metrics.activeAgents} Ativos`}
            isPositive={true}
            icon={<Bot size={22} />}
            description="Agentes criados na empresa"
          />
          <StatsCard
            title="Agentes Ativos"
            value={loading ? '...' : metrics.activeAgents}
            trend="100% Operacional"
            isPositive={true}
            icon={<Zap size={22} />}
            description="Agentes prontos para atendimento"
          />
          <StatsCard
            title="Total de Execuções"
            value={loading ? '...' : metrics.totalExecutions}
            trend="+12% este mês"
            isPositive={true}
            icon={<Play size={22} />}
            description="Interações processadas por IA"
          />
          <StatsCard
            title="Consumo de Tokens"
            value={loading ? '...' : metrics.totalTokens.toLocaleString('pt-BR')}
            trend={`Custo est.: R$ ${metrics.totalCost.toFixed(2)}`}
            isPositive={true}
            icon={<Coins size={22} />}
            description="Volume total de contexto processado"
          />
        </div>

        {/* Seção Principal: Provedores e Últimas Execuções */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card Provedores Suportados */}
          <div className="lg:col-span-1 bg-slate-900 text-white rounded-2xl p-6 shadow-xl space-y-4 border border-slate-800 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-400 flex items-center gap-1.5">
                  <Cpu size={16} /> Multi-Provider Architecture
                </span>
                <Badge variant="blue">Desacoplado</Badge>
              </div>

              <h3 className="text-lg font-bold text-white">Suporte a Qualquer LLM</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sua empresa pode alternar entre provedores de IA sem alterar a lógica dos agentes.
              </p>

              <div className="space-y-2 pt-2">
                {[
                  { name: 'OpenAI (GPT-4o, o3)', status: 'Ativo' },
                  { name: 'Anthropic (Claude 3.5)', status: 'Ativo' },
                  { name: 'Google (Gemini 1.5 Pro)', status: 'Ativo' },
                  { name: 'DeepSeek V3 & R1', status: 'Ativo' },
                  { name: 'xAI Grok 2', status: 'Ativo' },
                  { name: 'Ollama (Modelos Locais)', status: 'Ativo' },
                ].map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-slate-800/60 border border-slate-700/50">
                    <span className="font-medium text-slate-200">{p.name}</span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Link href="/ai-studio/models" className="block pt-2">
              <Button variant="secondary" className="w-full bg-slate-800 hover:bg-slate-700 text-xs" rightIcon={<ArrowRight size={14} />}>
                Ver Todos os Modelos
              </Button>
            </Link>
          </div>

          {/* Tabela de Últimas Execuções */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="text-brand-500" size={18} /> Últimas Execuções de IA
                </h3>
                <Link href="/ai-studio/executions" className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
                  Ver Todas <ArrowRight size={12} />
                </Link>
              </div>

              {loading ? (
                <div className="py-12 text-center text-slate-400 text-xs">Carregando execuções...</div>
              ) : metrics.recentExecutions.length === 0 ? (
                <div className="py-12 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50 text-slate-400 text-xs space-y-2">
                  <Bot size={28} className="mx-auto text-slate-300" />
                  <p className="font-medium">Nenhuma execução registrada ainda.</p>
                  <p className="text-[11px] text-slate-400">Crie seu primeiro agente para iniciar as execuções.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {metrics.recentExecutions.map((exec) => (
                    <div key={exec.id} className="py-3 flex items-center justify-between text-xs hover:bg-slate-50 rounded-lg px-2 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-brand-50 text-brand-600">
                          <Bot size={16} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{exec.agent?.name || 'Agente IA'}</p>
                          <p className="text-[10px] text-slate-500">{exec.modelName} • {exec.provider}</p>
                        </div>
                      </div>

                      <div className="text-right space-y-0.5">
                        <span className="font-mono font-semibold text-slate-700">{exec.totalTokens} tokens</span>
                        <p className="text-[10px] text-slate-400 flex items-center justify-end gap-1">
                          <Clock size={10} /> {exec.executionTimeMs}ms
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Status dos Servidores MCP: <strong className="text-emerald-600 font-semibold">100% Conectado</strong></span>
              <Link href="/ai-studio/tools" className="text-brand-600 font-semibold hover:underline">
                Gerenciar MCP
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
