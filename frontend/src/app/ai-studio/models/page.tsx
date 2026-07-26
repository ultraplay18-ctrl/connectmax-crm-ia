'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { AiStudioHeader } from '../../../components/ai-studio/AiStudioHeader';
import { AiStudioNavigation } from '../../../components/ai-studio/AiStudioNavigation';
import { Badge } from '../../../components/Badge';
import { api } from '../../../services/api';
import { Cpu, CheckCircle2, Zap, ShieldCheck, DollarSign, Layers } from 'lucide-react';

export default function AiModelsPage() {
  const [models, setModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchModels = async () => {
    setLoading(true);
    try {
      const response = await api.get('/ai-studio/models');
      setModels(response.data || []);
    } catch (err) {
      console.error('Erro ao buscar modelos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <AiStudioHeader
          title="Catálogo de Modelos e Provedores LLM"
          subtitle="Provedores suportados pela arquitetura agnóstica do AI Studio."
          activeTab="Modelos"
        />

        <AiStudioNavigation />

        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs">Carregando catálogo de modelos...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {models.map((model) => (
              <div
                key={model.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-600 border border-brand-200">
                      {model.provider}
                    </span>
                    {model.isDefault && <Badge variant="green">Padrão</Badge>}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Cpu size={20} className="text-brand-500" /> {model.name}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed min-h-[3rem]">
                    {model.description}
                  </p>
                </div>

                <div className="space-y-2 pt-4 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Janela de Contexto:</span>
                    <span className="font-semibold font-mono text-slate-900">
                      {model.contextWindow.toLocaleString('pt-BR')} tokens
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Tokens de Saída Max:</span>
                    <span className="font-semibold font-mono text-slate-900">
                      {model.maxOutputTokens.toLocaleString('pt-BR')} tokens
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Status de Prontidão:</span>
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 size={14} /> Ativo
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
