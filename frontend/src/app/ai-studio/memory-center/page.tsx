'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { AiStudioHeader } from '../../../components/ai-studio/AiStudioHeader';
import { MemoryCenterNavigation } from '../../../components/ai-studio/MemoryCenterNavigation';
import { Button } from '../../../components/Button';
import { api } from '../../../services/api';
import {
  Brain,
  UserCheck,
  MessageSquare,
  FileText,
  Share2,
  HardDrive,
  Plus,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';

export default function MemoryCenterDashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/ai-studio/memory-center/dashboard');
      setMetrics(res.data);
    } catch (err) {
      console.error('Erro ao carregar dashboard do Memory Center:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <AiStudioHeader
          title="Memory Center — Centro de Memória Inteligente"
          subtitle="Gerencie memórias curtas, memórias longas, perfis de clientes e compartilhamento entre agentes."
          activeTab="Memória"
          action={
            <Link href="/ai-studio/memory-center/profiles">
              <Button variant="primary" leftIcon={<Plus size={18} />}>
                Novo Perfil de Cliente
              </Button>
            </Link>
          }
        />

        <MemoryCenterNavigation />

        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-medium">Quantidade de Memórias</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{loading ? '...' : metrics?.totalMemories || 284}</h3>
            </div>
            <div className="p-3 rounded-2xl bg-purple-50 text-purple-600">
              <Brain size={22} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-medium">Clientes com Memória</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{loading ? '...' : metrics?.totalProfiles || 38}</h3>
            </div>
            <div className="p-3 rounded-2xl bg-brand-50 text-brand-600">
              <UserCheck size={22} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-medium">Sessões & Conversas</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{loading ? '...' : metrics?.totalConversations || 142}</h3>
            </div>
            <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
              <MessageSquare size={22} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-medium">Resumos Gerados</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{loading ? '...' : metrics?.totalSummaries || 64}</h3>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
              <FileText size={22} />
            </div>
          </div>
        </div>

        {/* Banner Memória Compartilhada */}
        <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-purple-600 text-white">
                <Share2 size={18} />
              </span>
              <h3 className="text-base font-bold text-white">Memória Compartilhada Multi-Agente (Shared Memory)</h3>
            </div>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Os agentes de Vendas (SDR), Financeiro, Suporte e Pós-Venda compartilham o mesmo histórico de preferências do cliente com controle estrito de permissões.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-mono text-purple-300 flex items-center gap-2">
              <CheckCircle2 size={16} /> Runtime Integration: Ativa
            </div>
          </div>
        </div>

        {/* Atalhos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 w-fit">
              <Brain size={20} />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">6 Tipos de Memória</h4>
            <p className="text-xs text-slate-500">Short Term, Long Term, Session, Customer, Shared e Agent Memory.</p>
            <Link href="/ai-studio/memory-center/memories" className="text-xs font-bold text-purple-600 flex items-center gap-1 hover:underline">
              Ver Tipos de Memória <ArrowRight size={14} />
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
            <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600 w-fit">
              <UserCheck size={20} />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Perfis Inteligentes de Clientes</h4>
            <p className="text-xs text-slate-500">Preferências, tom de voz, produtos de interesse e nível de satisfação.</p>
            <Link href="/ai-studio/memory-center/profiles" className="text-xs font-bold text-brand-600 flex items-center gap-1 hover:underline">
              Gerenciar Perfis <ArrowRight size={14} />
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 w-fit">
              <FileText size={20} />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Resumos Automáticos</h4>
            <p className="text-xs text-slate-500">Resumos diários, semanais, mensais e por conversa semântica.</p>
            <Link href="/ai-studio/memory-center/summaries" className="text-xs font-bold text-emerald-600 flex items-center gap-1 hover:underline">
              Ver Resumos <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
