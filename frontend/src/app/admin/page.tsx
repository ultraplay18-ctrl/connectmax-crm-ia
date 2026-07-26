'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card } from '../../components/Card';
import { StatsCard } from '../../components/StatsCard';
import { api } from '../../services/api';
import {
  ShieldCheck,
  Building,
  Users,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CreditCard,
  PieChart,
} from 'lucide-react';

export default function SuperAdminDashboardPage() {
  const [metrics, setMetrics] = useState<any>({
    totalCompanies: 0,
    activeCompanies: 0,
    suspendedCompanies: 0,
    totalUsers: 0,
    mrr: 0,
    plansDistribution: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        setMetrics(res.data || {});
      } catch (err) {
        console.error('Erro ao carregar métricas do Super Admin:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="text-emerald-600" /> Painel Super Administrador SaaS
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Visão executiva global do ConnectMax CRM IA: faturamento MRR, empresas ativas, usuários e consumo.
            </p>
          </div>
        </div>

        {/* CARDS DE METRICAS EXECUTIVAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatsCard
            title="Receita Recorrente (MRR)"
            value={formatCurrency(metrics.mrr)}
            icon={<TrendingUp className="text-emerald-600" size={24} />}
          />
          <StatsCard
            title="Empresas Totais"
            value={metrics.totalCompanies?.toString()}
            icon={<Building className="text-brand-500" size={24} />}
          />
          <StatsCard
            title="Empresas Ativas"
            value={metrics.activeCompanies?.toString()}
            icon={<ShieldCheck className="text-emerald-500" size={24} />}
          />
          <StatsCard
            title="Empresas Bloqueadas"
            value={metrics.suspendedCompanies?.toString()}
            icon={<AlertCircle className="text-rose-500" size={24} />}
          />
          <StatsCard
            title="Usuários Totais SaaS"
            value={metrics.totalUsers?.toString()}
            icon={<Users className="text-indigo-500" size={24} />}
          />
        </div>

        {/* GRAFICOS & DISTRIBUIÇÃO */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card title="Distribuição de Planos Contratados" className="lg:col-span-2">
            {loading ? (
              <div className="py-12 text-center text-xs text-slate-400">Carregando métricas...</div>
            ) : metrics.plansDistribution?.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">Nenhum plano distribuído ainda.</div>
            ) : (
              <div className="space-y-4 py-2">
                {metrics.plansDistribution.map((item: any) => (
                  <div key={item.name} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between font-medium">
                      <span className="text-slate-800 font-bold">{item.name}</span>
                      <span className="font-mono text-slate-600 font-bold">{item.count} empresa(s)</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                      <div
                        className="h-full bg-gradient-to-r from-brand-600 to-indigo-600 rounded-full"
                        style={{
                          width: `${Math.min(100, (item.count / (metrics.totalCompanies || 1)) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card title="Atalhos Rápidos de Gestão">
            <div className="space-y-3 text-xs">
              <a
                href="/admin/companies"
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-brand-50 hover:border-brand-300 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <Building size={18} className="text-brand-600" />
                  <div>
                    <strong className="block text-slate-900 group-hover:text-brand-700">Gestão de Empresas</strong>
                    <span className="text-[11px] text-slate-500">Bloquear, suspender ou alterar planos</span>
                  </div>
                </div>
              </a>

              <a
                href="/admin/subscriptions"
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-emerald-50 hover:border-emerald-300 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <CreditCard size={18} className="text-emerald-600" />
                  <div>
                    <strong className="block text-slate-900 group-hover:text-emerald-700">Gestão de Assinaturas</strong>
                    <span className="text-[11px] text-slate-500">Relatório global de cobranças</span>
                  </div>
                </div>
              </a>

              <a
                href="/admin/audit-logs"
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-indigo-50 hover:border-indigo-300 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck size={18} className="text-indigo-600" />
                  <div>
                    <strong className="block text-slate-900 group-hover:text-indigo-700">Logs Globais de Auditoria</strong>
                    <span className="text-[11px] text-slate-500">Rastreamento irrestrito de segurança</span>
                  </div>
                </div>
              </a>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
