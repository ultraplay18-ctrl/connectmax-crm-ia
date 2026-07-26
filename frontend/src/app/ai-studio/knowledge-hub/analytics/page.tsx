'use client';

import React from 'react';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';
import { AiStudioHeader } from '../../../../components/ai-studio/AiStudioHeader';
import { KnowledgeHubNavigation } from '../../../../components/ai-studio/KnowledgeHubNavigation';
import { BarChart3, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';

export default function KnowledgeAnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <AiStudioHeader
          title="Analytics de Uso de Conhecimento"
          subtitle="Métricas de acerto semântico RAG, documentos mais consultados e eficiência dos Agentes."
          activeTab="Base de Conhecimento"
        />

        <KnowledgeHubNavigation />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
            <span className="text-xs text-slate-500 font-medium">Taxa de Resposta RAG Direta</span>
            <h3 className="text-2xl font-bold text-slate-900">94.8%</h3>
            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
              <TrendingUp size={12} /> +3.2% este mês
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
            <span className="text-xs text-slate-500 font-medium">Documento Mais Consultado</span>
            <h3 className="text-sm font-bold text-slate-900 line-clamp-1">Manual_Produtos_2026.pdf</h3>
            <span className="text-[10px] text-slate-400 font-mono">1.420 pesquisas ativas</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
            <span className="text-xs text-slate-500 font-medium">Consultas RAG sem Agente Humano</span>
            <h3 className="text-2xl font-bold text-slate-900">89.1%</h3>
            <span className="text-[10px] text-emerald-600 font-bold">Respostas precisas</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
