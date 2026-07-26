'use client';

import React from 'react';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';
import { AiStudioHeader } from '../../../../components/ai-studio/AiStudioHeader';
import { PlaygroundNavigation } from '../../../../components/ai-studio/PlaygroundNavigation';
import { BarChart3, Clock, Cpu, HardDrive, DollarSign, Wrench, Brain } from 'lucide-react';

export default function PlaygroundAnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <AiStudioHeader
          title="Telemetria do Laboratório (Playground Analytics)"
          subtitle="Acompanhe tempo de resposta, consumo de tokens, custo simulado, ferramentas acionadas e memória."
          activeTab="Playground"
        />

        <PlaygroundNavigation />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
            <span className="text-xs text-slate-500 font-medium">Tempo Médio de Resposta</span>
            <h3 className="text-2xl font-bold text-slate-900">420 ms</h3>
            <span className="text-[10px] text-emerald-600 font-bold">Latência excelente</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
            <span className="text-xs text-slate-500 font-medium">Total de Tokens Consumidos</span>
            <h3 className="text-2xl font-bold text-slate-900">14.820</h3>
            <span className="text-[10px] text-slate-400 font-mono">Simulação Playground</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
            <span className="text-xs text-slate-500 font-medium">Custo Estimado Simulado</span>
            <h3 className="text-2xl font-bold text-slate-900">$0.048</h3>
            <span className="text-[10px] text-brand-600 font-bold">gpt-4o standard</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
            <span className="text-xs text-slate-500 font-medium">Ferramentas & RAG Acionados</span>
            <h3 className="text-2xl font-bold text-slate-900">98.2%</h3>
            <span className="text-[10px] text-emerald-600 font-bold">Alta precisão</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
