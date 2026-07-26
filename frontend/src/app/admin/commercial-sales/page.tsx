'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
import { api } from '../../../services/api';
import {
  Sparkles,
  Users,
  Target,
  DollarSign,
  TrendingUp,
  Search,
  Filter,
  ArrowRight,
  UserCheck,
  Building,
  Calendar,
  Phone,
} from 'lucide-react';
import Link from 'next/link';

export default function CommercialSalesPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>({
    leadsReceived: 0,
    conversionRate: 0,
    demosScheduled: 0,
    clientsWon: 0,
    forecastRevenue: 0,
    vendorsCount: 0,
  });

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlan, setFilterPlan] = useState('');
  const [filterVendor, setFilterVendor] = useState('');

  const fetchSalesData = async () => {
    setLoading(true);
    try {
      const [leadsRes, vendorsRes, metricsRes] = await Promise.all([
        api.get('/admin/commercial-leads'),
        api.get('/admin/commercial-vendors'),
        api.get('/admin/commercial-dashboard'),
      ]);

      setLeads(leadsRes.data || []);
      setVendors(vendorsRes.data || []);
      setMetrics(metricsRes.data || {});
    } catch (err) {
      console.error('Erro ao buscar dados do CRM comercial:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  const kanbanColumns = [
    { name: 'Novo Lead', bg: 'bg-slate-900/40 border-slate-800' },
    { name: 'Contato Inicial', bg: 'bg-indigo-950/20 border-indigo-900/30' },
    { name: 'Demonstração Agendada', bg: 'bg-amber-950/20 border-amber-900/30' },
    { name: 'Proposta Enviada', bg: 'bg-blue-950/20 border-blue-900/30' },
    { name: 'Negociação', bg: 'bg-purple-950/20 border-purple-900/30' },
    { name: 'Cliente Ativo', bg: 'bg-emerald-950/20 border-emerald-900/30' },
    { name: 'Perdido', bg: 'bg-red-950/20 border-red-900/30' },
  ];

  // Aplicar busca e filtros no client-side para resposta instantânea
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPlan = filterPlan ? lead.planName === filterPlan : true;
    const matchesVendor = filterVendor ? lead.responsibleId === filterVendor : true;

    return matchesSearch && matchesPlan && matchesVendor;
  });

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Target className="text-brand-500" /> CRM Vendas SaaS (Interno)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Painel comercial exclusivo para equipe de vendas ConnectMax gerenciar leads e converter novos clientes SaaS.
          </p>
        </div>

        {/* INDICADORES COMERCIAIS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Leads Recebidos</span>
            <div className="text-2xl font-bold text-slate-900 font-mono">{metrics.leadsReceived}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Conversão Comercial</span>
            <div className="text-2xl font-bold text-slate-900 font-mono">{metrics.conversionRate}%</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Demonstrações</span>
            <div className="text-2xl font-bold text-slate-900 font-mono">{metrics.demosScheduled}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Clientes Ativos</span>
            <div className="text-2xl font-bold text-slate-900 font-mono text-emerald-600">{metrics.clientsWon}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Receita Prevista</span>
            <div className="text-2xl font-bold text-brand-650 font-mono">{formatCurrency(metrics.forecastRevenue)}</div>
          </div>
        </div>

        {/* FILTROS E BUSCA */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-grow max-w-md relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Buscar por nome, empresa ou email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 text-xs">
              <Filter size={14} className="text-slate-400" />
              <select
                value={filterPlan}
                onChange={(e) => setFilterPlan(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-700"
              >
                <option value="">Todos os Planos</option>
                <option value="Starter">Starter</option>
                <option value="Professional">Professional</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>

            <div className="flex items-center gap-1 text-xs">
              <UserCheck size={14} className="text-slate-400" />
              <select
                value={filterVendor}
                onChange={(e) => setFilterVendor(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-700"
              >
                <option value="">Todos os Vendedores</option>
                {vendors.map((vendor) => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* PIPELINE KANBAN */}
        {loading ? (
          <div className="py-24 text-center text-xs text-slate-500">Buscando funil de leads do SaaS...</div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4 items-start min-h-[480px]">
            {kanbanColumns.map((col) => {
              const leadsInCol = filteredLeads.filter((l) => l.status === col.name);

              return (
                <div
                  key={col.name}
                  className={`w-72 shrink-0 rounded-2xl border p-4 flex flex-col gap-4 self-stretch ${col.bg}`}
                >
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-bold text-xs text-slate-800">{col.name}</span>
                    <Badge variant={col.name === 'Cliente Ativo' ? 'green' : 'slate'}>
                      {leadsInCol.length}
                    </Badge>
                  </div>

                  <div className="flex flex-col gap-3 overflow-y-auto max-h-[420px] pr-1">
                    {leadsInCol.length === 0 ? (
                      <div className="py-8 text-center text-[10px] text-slate-400 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                        Nenhum lead aqui
                      </div>
                    ) : (
                      leadsInCol.map((lead) => (
                        <div
                          key={lead.id}
                          className="bg-white border border-slate-250 p-4 rounded-xl shadow-sm hover:border-brand-500/60 hover:shadow-md transition-all flex flex-col justify-between gap-3 relative group"
                        >
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-start gap-2">
                              <strong className="text-xs text-slate-900 block font-bold truncate max-w-[140px]">
                                {lead.name}
                              </strong>
                              <Badge variant="blue">{lead.planName}</Badge>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-slate-500">
                              <Building size={12} className="shrink-0" />
                              <span className="truncate">{lead.companyName}</span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-slate-550 font-mono">
                              <Phone size={12} className="shrink-0" />
                              <span>{lead.phone}</span>
                            </div>
                          </div>

                          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-400">
                            <span className="font-mono">{new Date(lead.createdAt).toLocaleDateString('pt-BR')}</span>
                            <span className="bg-slate-100 text-slate-650 px-2 py-0.5 rounded font-semibold truncate max-w-[90px]">
                              👤 {lead.responsible?.name || 'Sem vendedor'}
                            </span>
                          </div>

                          {/* Link to Details */}
                          <Link href={`/admin/commercial-sales/${lead.id}`}>
                            <span className="absolute inset-0 cursor-pointer rounded-xl" />
                          </Link>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
