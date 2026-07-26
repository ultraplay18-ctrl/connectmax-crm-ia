'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';
import { AiStudioHeader } from '../../../../components/ai-studio/AiStudioHeader';
import { ProvidersNavigation } from '../../../../components/ai-studio/ProvidersNavigation';
import { Button } from '../../../../components/Button';
import { api } from '../../../../services/api';
import { GitMerge, ArrowRight, Save, CheckCircle2 } from 'lucide-react';

export default function FallbackChainPage() {
  const [chain, setChain] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchFallback();
  }, []);

  const fetchFallback = async () => {
    try {
      const res = await api.get('/ai-studio/providers/fallback');
      setChain(res.data || []);
    } catch (err) {
      console.error('Erro ao buscar cadeia de fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/ai-studio/providers/fallback', {
        providers: chain.map((c) => c.provider),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Erro ao salvar fallback:', err);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <AiStudioHeader
          title="Cadeia de Redundância (Fallback Chain)"
          subtitle="Configure a ordem automática de failover entre os provedores em caso de indisponibilidade."
          activeTab="Provedores"
        />

        <ProvidersNavigation />

        <form onSubmit={handleSave} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6 max-w-3xl">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <GitMerge className="text-emerald-600" size={18} /> Ordem Prioritária de Failover
            </h4>
            <span className="text-xs font-mono font-bold text-slate-500">6 Níveis de Redundância</span>
          </div>

          <div className="space-y-3">
            {chain.map((item, index) => (
              <div key={item.id || index} className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center font-mono">
                    #{index + 1}
                  </span>
                  <div>
                    <h5 className="font-bold text-sm text-white">{item.provider}</h5>
                    <span className="text-[10px] text-slate-400 font-mono">Prioridade nível {index + 1}</span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 size={14} /> Ativo
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" variant="primary" leftIcon={<Save size={16} />}>
              Salvar Ordem de Fallback
            </Button>
            {saved && (
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 size={16} /> Ordem salva com sucesso!
              </span>
            )}
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
