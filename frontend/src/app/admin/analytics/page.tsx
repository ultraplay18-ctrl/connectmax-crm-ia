'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
import { api } from '../../../services/api';
import {
  TrendingUp,
  Users,
  Target,
  DollarSign,
  Building,
  Activity,
  Calendar,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  PieChart,
} from 'lucide-react';

export default function SaasAnalyticsPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/analytics/metrics');
      setMetrics(res.data);
    } catch (err) {
      console.error('Erro ao buscar analytics SaaS:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="py-24 text-center text-xs text-slate-500 font-sans">Carregando painel estratégico SaaS...</div>
      </DashboardLayout>
    );
  }

  if (!metrics) {
    return (
      <DashboardLayout>
        <div className="py-24 text-center text-xs text-red-500 font-sans">Erro ao carregar dados de inteligência de negócios.</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Activity className="text-brand-500" /> SaaS Analytics & Business Intelligence
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Painel consolidado corporativo para acompanhamento de crescimento de receita recorrente, churn e conversão comercial.
          </p>
        </div>

        {/* KPIs SaaS Executivos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">MRR (Recorrência)</span>
            <div className="text-xl font-bold text-slate-900 font-mono">{formatCurrency(metrics.mrr)}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">ARR (Projetado)</span>
            <div className="text-xl font-bold text-slate-900 font-mono">{formatCurrency(metrics.arr)}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Clientes Ativos</span>
            <div className="text-xl font-bold text-emerald-650 font-mono">{metrics.activeClients}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Novos no Mês</span>
            <div className="text-xl font-bold text-brand-650 font-mono">+{metrics.newClientsThisMonth}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold font-sans">Cancelamentos</span>
            <div className="text-xl font-bold text-rose-600 font-mono">{metrics.cancellations}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Taxa Crescimento</span>
            <div className="text-xl font-bold text-slate-900 font-mono">+{metrics.growthRate}%</div>
          </div>
        </div>

        {/* DISTRIBUIÇÃO E MÉTRICAS DE PLANOS & CHURN */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Receita por Plano */}
          <div className="lg:col-span-1">
            <Card title="Receita por Plano">
              <div className="space-y-4 py-2">
                {metrics.plansDistribution?.map((p: any) => (
                  <div key={p.name} className="flex items-center justify-between text-xs pb-3 border-b border-slate-100 last:border-b-0 last:pb-0">
                    <div className="space-y-0.5">
                      <strong className="text-slate-800 font-bold block">{p.name}</strong>
                      <span className="text-slate-400 text-[10px]">{p.activeCount} assinantes ativos</span>
                    </div>
                    <div className="text-right font-mono font-bold text-slate-900">
                      {formatCurrency(p.revenue)}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Trials & Conversão */}
          <div className="lg:col-span-1">
            <Card title="Degustação & Teste Grátis (Trial)">
              <div className="space-y-5 py-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Períodos de Trial Ativos:</span>
                  <Badge variant="blue">{metrics.activeTrials} ativos</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Assinaturas Convertidas:</span>
                  <Badge variant="green">{metrics.trialsConverted} convertidos</Badge>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 leading-relaxed">
                  <strong className="text-[10px] text-slate-700 block">Eficiência de Aquisição</strong>
                  <p className="text-[9px] text-slate-450">
                    A conversão média de trial para plano ativo está em **15.4%** no trimestre atual.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Churn e Cancelamentos */}
          <div className="lg:col-span-1">
            <Card title="Métricas de Churn (Rotatividade)">
              <div className="space-y-4 py-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Taxa de Churn Mensal:</span>
                  <Badge variant={metrics.churnRate > 5 ? 'red' : 'slate'}>{metrics.churnRate}%</Badge>
                </div>
                <div className="space-y-2">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Principais Motivos:</span>
                  {metrics.churnReasons?.map((reason: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-slate-650">
                      <span>• {reason.reason}</span>
                      <strong className="font-mono text-slate-800">{reason.count} cancelamentos</strong>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* MÓDULOS DE GRAFICOS SAAS (Visual Simulado Premium via CSS) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Crescimento Recorrente Mensal */}
          <Card title="Evolução da Receita Recorrente (MRR)">
            <div className="space-y-6 py-2">
              <div className="h-44 flex items-end gap-5 pt-6 px-4">
                {metrics.charts?.historicalRevenue?.map((item: any, idx: number) => (
                  <div key={idx} className="w-full bg-slate-100 rounded-t-lg relative group h-full flex flex-col justify-end">
                    {/* Simulated fill height */}
                    <div
                      className="bg-brand-500 rounded-t-lg relative transition-all group-hover:bg-brand-600 cursor-pointer"
                      style={{ height: `${(item.revenue / metrics.mrr) * 100}%` }}
                    >
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] px-2 py-0.5 rounded shadow mb-1 hidden group-hover:block font-mono">
                        {formatCurrency(item.revenue)}
                      </div>
                    </div>
                    <span className="absolute top-full left-1/2 -translate-x-1/2 pt-2 text-[9.5px] text-slate-450 font-semibold uppercase block">
                      {item.month}
                    </span>
                  </div>
                ))}
              </div>
              <div className="text-[10px] text-slate-400 text-center pt-2">Evolução do faturamento SaaS nos últimos 6 meses.</div>
            </div>
          </Card>

          {/* Evolução de Base de Clientes */}
          <Card title="Crescimento da Base de Clientes Ativos">
            <div className="space-y-6 py-2">
              <div className="h-44 flex items-end gap-5 pt-6 px-4">
                {metrics.charts?.historicalClients?.map((item: any, idx: number) => (
                  <div key={idx} className="w-full bg-slate-100 rounded-t-lg relative group h-full flex flex-col justify-end">
                    {/* Simulated fill height */}
                    <div
                      className="bg-indigo-500 rounded-t-lg relative transition-all group-hover:bg-indigo-600 cursor-pointer"
                      style={{ height: `${(item.clients / metrics.activeClients) * 100}%` }}
                    >
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] px-2 py-0.5 rounded shadow mb-1 hidden group-hover:block font-mono">
                        {item.clients} cls
                      </div>
                    </div>
                    <span className="absolute top-full left-1/2 -translate-x-1/2 pt-2 text-[9.5px] text-slate-450 font-semibold uppercase block">
                      {item.month}
                    </span>
                  </div>
                ))}
              </div>
              <div className="text-[10px] text-slate-400 text-center pt-2">Crescimento de empresas clientes ativas no ConnectMax.</div>
            </div>
          </Card>
        </div>

        {/* COMMERCIAL CONVERSION METRICS */}
        <Card title="Conversão Comercial & Leads de Atração">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-2 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-500">Leads Comerciais Capturados:</span>
              <div className="text-lg font-bold text-slate-800 font-mono">{metrics.commercial?.leadsReceived} leads</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-500">Taxa de Fechamento / Conversão:</span>
              <div className="text-lg font-bold text-slate-800 font-mono">{metrics.commercial?.conversionRate}%</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-500">Valor de Receita Prevista:</span>
              <div className="text-lg font-bold text-brand-650 font-mono">{formatCurrency(metrics.commercial?.forecastRevenue)} /mês</div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
