'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { AiStudioHeader } from '../../../components/ai-studio/AiStudioHeader';
import { ProvidersNavigation } from '../../../components/ai-studio/ProvidersNavigation';
import { Button } from '../../../components/Button';
import { api } from '../../../services/api';
import { Cpu, CheckCircle2, AlertTriangle, GitMerge, Clock, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ProvidersDashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [dashRes, provRes] = await Promise.all([
        api.get('/ai-studio/providers/dashboard'),
        api.get('/ai-studio/providers'),
      ]);
      setMetrics(dashRes.data);
      setProviders(provRes.data || []);
    } catch (err) {
      console.error('Erro ao carregar dados do Provider Manager:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <AiStudioHeader
          title="AI Provider Manager — Dashboard"
          subtitle="Gerencie status, limites, timeouts e modelos dos 7 Provedores de IA."
          activeTab="Provedores"
          action={
            <Link href="/ai-studio/secrets">
              <Button variant="primary" leftIcon={<LockIcon />}>
                Gerenciar API Keys
              </Button>
            </Link>
          }
        />

        <ProvidersNavigation />

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-medium">Provedores Suportados</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{loading ? '...' : metrics?.totalProviders || 7}</h3>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
              <Cpu size={22} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-medium">Provedores Ativos</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{loading ? '...' : metrics?.activeProviders || 7}</h3>
            </div>
            <div className="p-3 rounded-2xl bg-brand-50 text-brand-600">
              <CheckCircle2 size={22} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-medium">Modelo Padrão Global</span>
              <h3 className="text-sm font-bold text-slate-900 mt-1 font-mono">{loading ? '...' : metrics?.defaultModel || 'gpt-4o'}</h3>
            </div>
            <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
              <Zap size={22} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-medium">Tempo Médio Global</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{loading ? '...' : `${metrics?.avgLatencyMs || 340} ms`}</h3>
            </div>
            <div className="p-3 rounded-2xl bg-purple-50 text-purple-600">
              <Clock size={22} />
            </div>
          </div>
        </div>

        {/* Grid dos Provedores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((prov) => (
            <div key={prov.id || prov.providerName} className="bg-white rounded-3xl border border-slate-200/80 p-5 space-y-4 shadow-sm hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-slate-900 text-white font-bold text-xs font-mono">
                    {prov.providerName.substring(0, 3).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{prov.providerName}</h4>
                    <span className="text-[11px] font-mono text-slate-500">Modelo: {prov.defaultModel}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {prov.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-3 rounded-2xl border border-slate-200 font-mono text-slate-700">
                <div>Timeout: {prov.timeoutMs}ms</div>
                <div>Retries: {prov.retryCount}x</div>
                <div>Fallback: {prov.fallbackEnabled ? 'Sim' : 'Não'}</div>
                <div>Streaming: {prov.streamingEnabled ? 'Sim' : 'Não'}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

function LockIcon() {
  return <Cpu size={18} />;
}
