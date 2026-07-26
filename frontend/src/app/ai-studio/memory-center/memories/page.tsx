'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';
import { AiStudioHeader } from '../../../../components/ai-studio/AiStudioHeader';
import { MemoryCenterNavigation } from '../../../../components/ai-studio/MemoryCenterNavigation';
import { Brain, Layers, Clock, Users, Share2, Bot, CheckCircle2 } from 'lucide-react';

export default function MemoryTypesPage() {
  const [selectedType, setSelectedType] = useState('ALL');

  const memoryTypes = [
    {
      id: 'SHORT_TERM',
      name: 'Short Term Memory',
      desc: 'Retém dados da conversa atual durante a janela de sessão ativa.',
      icon: Clock,
      color: 'border-brand-500 bg-brand-50/50 text-brand-900',
      activeCount: 142,
    },
    {
      id: 'LONG_TERM',
      name: 'Long Term Memory',
      desc: 'Mantém fatos históricos relevantes entre múltiplas sessões.',
      icon: Brain,
      color: 'border-purple-500 bg-purple-50/50 text-purple-900',
      activeCount: 88,
    },
    {
      id: 'SESSION',
      name: 'Session Memory',
      desc: 'Armazena chaves temporárias, variáveis de estado e fluxos ativos.',
      icon: Layers,
      color: 'border-indigo-500 bg-indigo-50/50 text-indigo-900',
      activeCount: 54,
    },
    {
      id: 'CUSTOMER',
      name: 'Customer Memory',
      desc: 'Grava hábitos, preferências de produto, idioma e tom do cliente.',
      icon: Users,
      color: 'border-emerald-500 bg-emerald-50/50 text-emerald-900',
      activeCount: 38,
    },
    {
      id: 'SHARED',
      name: 'Shared Memory',
      desc: 'Compartilha o contexto do cliente entre agentes de SDR, Suporte e Finanças.',
      icon: Share2,
      color: 'border-amber-500 bg-amber-50/50 text-amber-900',
      activeCount: 12,
    },
    {
      id: 'AGENT',
      name: 'Agent Memory',
      desc: 'Memória de aprendizado individual específica de cada agente.',
      icon: Bot,
      color: 'border-rose-500 bg-rose-50/50 text-rose-900',
      activeCount: 24,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <AiStudioHeader
          title="Gestão dos 6 Tipos de Memória"
          subtitle="Visualize e configure os motores de memória utilizados pelos Agentes de IA."
          activeTab="Memória"
        />

        <MemoryCenterNavigation />

        {/* Grid dos 6 Tipos de Memória */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memoryTypes.map((mem) => {
            const Icon = mem.icon;
            return (
              <div
                key={mem.id}
                className={`p-6 rounded-3xl border ${mem.color} shadow-sm space-y-4 flex flex-col justify-between`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-white shadow-sm border border-slate-200">
                      <Icon size={24} className="text-slate-800" />
                    </div>
                    <span className="text-xs font-mono font-bold bg-white px-2.5 py-1 rounded-full border border-slate-200 text-slate-800">
                      {mem.activeCount} registros
                    </span>
                  </div>
                  <h4 className="font-bold text-base text-slate-900">{mem.name}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{mem.desc}</p>
                </div>

                <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold">
                  <span className="text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 size={14} /> Ativo no Runtime
                  </span>
                  <button className="text-purple-700 hover:underline">Configurar</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
