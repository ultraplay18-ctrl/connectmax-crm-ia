'use client';

import React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { StatsCard } from '../../components/StatsCard';
import { Card } from '../../components/Card';
import { useAuth } from '../../hooks/useAuth';
import { Users, DollarSign, Target, Bot, Sparkles, Building2, TrendingUp, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Badge } from '../../components/Badge';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Card 'Sua empresa está configurada' com atalhos rápidos */}
        {user?.settings?.onboardingCompleted && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 size={20} className="text-emerald-600" /> Sua empresa está 105% configurada!
              </h2>
              <p className="text-xs text-emerald-700">
                O onboarding foi concluído. Utilize os atalhos rápidos abaixo para explorar o potencial do sistema:
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <Link href="/contacts/new">
                <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer">
                  + Criar Cliente
                </span>
              </Link>
              <Link href="/leads">
                <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer">
                  + Criar Lead
                </span>
              </Link>
              <Link href="/whatsapp">
                <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer">
                  💬 Configurar WhatsApp
                </span>
              </Link>
              <Link href="/ai-assistant">
                <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-brand-650 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer">
                  🤖 Usar Assistente IA
                </span>
              </Link>
            </div>
          </div>
        )}

        {/* Banner de Boas-vindas SaaS Multi-Tenant */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-brand-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
          <div className="absolute right-0 top-0 -mr-12 -mt-12 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="blue">Fundação SaaS Ativa</Badge>
                <Badge variant="slate">Isolamento Multi-Tenant OK</Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Bem-vindo ao ConnectMax, {user?.name?.split(' ')[0]}! 👋
              </h1>
              <p className="mt-1 text-sm text-slate-300">
                Empresa Conectada: <span className="font-semibold text-white">{user?.companyName || 'Sua Empresa'}</span> (ID: <span className="font-mono text-xs text-brand-300">{user?.companyId?.substring(0, 8)}...</span>)
              </p>
            </div>

            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10 text-xs">
              <ShieldCheck className="text-emerald-400 shrink-0" size={20} />
              <div>
                <p className="font-semibold text-white">Ambiente Seguro e Isolado</p>
                <p className="text-slate-300">Nível de permissão: {typeof user?.role === 'object' ? (user?.role as any)?.name : user?.role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Grid de Cards Estatísticos Fictícios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatsCard
            title="Pipeline CRM"
            value="R$ 148.500,00"
            trend="+14.2%"
            isPositive={true}
            icon={<DollarSign size={20} />}
            description="Previsão de vendas registradas"
          />
          <StatsCard
            title="Leads Qualificados"
            value="342"
            trend="+8.5%"
            isPositive={true}
            icon={<Target size={20} />}
            description="Contatos no funil de vendas"
          />
          <StatsCard
            title="Usuários da Empresa"
            value="12 ativas"
            trend="Estável"
            isPositive={true}
            icon={<Users size={20} />}
            description="Membros associados ao tenant"
          />
          <StatsCard
            title="Interações da IA"
            value="1.240 ops"
            trend="+24.0%"
            isPositive={true}
            icon={<Bot size={20} />}
            description="Automações com Inteligência"
          />
        </div>

        {/* Espaços Preparados para Futuros Módulos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card Módulo CRM */}
          <Card
            title="Módulo CRM (Preparado para Futuro)"
            subtitle="Pipeline de vendas, funis customizáveis e gestão de contatos"
            action={<Badge variant="blue">Em Breve</Badge>}
          >
            <div className="p-6 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-center flex flex-col items-center justify-center min-h-[160px]">
              <Target size={36} className="text-slate-400 mb-2" />
              <p className="text-sm font-semibold text-slate-700">Módulo CRM de Vendas</p>
              <p className="text-xs text-slate-500 max-w-xs mt-1">
                A estrutura de banco de dados e APIs já está pronta para receber contatos, leads e oportunidades isoladas por empresa.
              </p>
            </div>
          </Card>

          {/* Card Módulo Financeiro */}
          <Card
            title="Módulo Financeiro (Preparado)"
            subtitle="Fluxo de caixa, faturamento SaaS, cobranças recorrentes"
            action={<Badge variant="slate">Em Breve</Badge>}
          >
            <div className="p-6 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-center flex flex-col items-center justify-center min-h-[160px]">
              <TrendingUp size={36} className="text-slate-400 mb-2" />
              <p className="text-sm font-semibold text-slate-700">Módulo Financeiro & SaaS</p>
              <p className="text-xs text-slate-500 max-w-xs mt-1">
                Arquitetura preparada para integração com gateways de pagamento e emissão de notas fiscais por tenant.
              </p>
            </div>
          </Card>

          {/* Card Módulo IA */}
          <Card
            title="Inteligência Artificial (Preparado)"
            subtitle="Assistentes virtuais, análise preditiva e automação de contatos"
            action={<Badge variant="amber">Em Breve</Badge>}
          >
            <div className="p-6 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-center flex flex-col items-center justify-center min-h-[160px]">
              <Sparkles size={36} className="text-brand-500 mb-2 animate-pulse" />
              <p className="text-sm font-semibold text-slate-700">Módulo ConnectMax IA</p>
              <p className="text-xs text-slate-500 max-w-xs mt-1">
                Suporte nativo para conectores LLM, extração inteligente de dados e atendimento automatizado.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
