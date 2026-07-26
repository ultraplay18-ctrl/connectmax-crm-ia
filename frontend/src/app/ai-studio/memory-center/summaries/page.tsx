'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';
import { AiStudioHeader } from '../../../../components/ai-studio/AiStudioHeader';
import { MemoryCenterNavigation } from '../../../../components/ai-studio/MemoryCenterNavigation';
import { api } from '../../../../services/api';
import { FileText, Sparkles, Plus, X } from 'lucide-react';
import { Button } from '../../../../components/Button';

export default function MemorySummariesPage() {
  const [summaries, setSummaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('');

  useEffect(() => {
    fetchSummaries();
  }, [selectedPeriod]);

  const fetchSummaries = async () => {
    try {
      const res = await api.get(`/ai-studio/memory-center/summaries?periodType=${selectedPeriod}`);
      setSummaries(res.data || []);
    } catch (err) {
      console.error('Erro ao carregar resumos:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <AiStudioHeader
          title="Resumos Automáticos"
          subtitle="Sínteses periódicas (Diário, Semanal, Mensal, Por Conversa) geradas pela IA."
          activeTab="Memória"
        />

        <MemoryCenterNavigation />

        {/* Filtro por Período */}
        <div className="flex items-center gap-2 overflow-x-auto bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm text-xs">
          <span className="font-bold text-slate-700 mr-2">Filtrar Período:</span>
          {['', 'DAILY', 'WEEKLY', 'MONTHLY', 'CONVERSATION', 'CUSTOMER'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
                selectedPeriod === period ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {period ? period : 'Todos'}
            </button>
          ))}
        </div>

        {/* Lista de Resumos */}
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs">Carregando resumos...</div>
        ) : summaries.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center text-xs text-slate-500 max-w-md mx-auto">
            Nenhum resumo gerado para este período.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {summaries.map((sum) => (
              <div key={sum.id} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="text-purple-600" size={16} /> {sum.profile?.customerName || 'Geral'}
                  </span>
                  <span className="text-[10px] font-mono bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-bold border border-purple-200">
                    {sum.periodType}
                  </span>
                </div>
                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed italic">
                  "{sum.content}"
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
