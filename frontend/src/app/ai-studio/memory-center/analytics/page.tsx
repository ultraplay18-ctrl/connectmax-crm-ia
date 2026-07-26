'use client';

import React from 'react';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';
import { AiStudioHeader } from '../../../../components/ai-studio/AiStudioHeader';
import { MemoryCenterNavigation } from '../../../../components/ai-studio/MemoryCenterNavigation';
import { BarChart3, Brain, Share2, TrendingUp } from 'lucide-react';

export default function MemoryAnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <AiStudioHeader
          title="Analytics de Memória & Retenção"
          subtitle="Telemetria de compartilhamento entre agentes, tamanho de histórico e resumos semânticos."
          activeTab="Memória"
        />

        <MemoryCenterNavigation />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
            <span className="text-xs text-slate-500 font-medium">Taxa de Acerto de Contexto</span>
            <h3 className="text-2xl font-bold text-slate-900">97.4%</h3>
            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
              <TrendingUp size={12} /> +1.8% em relação à última semana
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
            <span className="text-xs text-slate-500 font-medium">Memórias Compartilhadas Ativas</span>
            <h3 className="text-2xl font-bold text-slate-900">12 Agentes</h3>
            <span className="text-[10px] text-purple-600 font-mono font-bold">SDR ↔ Suporte ↔ Financeiro</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
            <span className="text-xs text-slate-500 font-medium">Compressão por Resumo Automático</span>
            <h3 className="text-2xl font-bold text-slate-900">78.5% Economia</h3>
            <span className="text-[10px] text-emerald-600 font-bold">Redução de consumo de Tokens</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
