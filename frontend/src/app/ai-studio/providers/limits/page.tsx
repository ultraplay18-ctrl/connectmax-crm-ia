'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';
import { AiStudioHeader } from '../../../../components/ai-studio/AiStudioHeader';
import { ProvidersNavigation } from '../../../../components/ai-studio/ProvidersNavigation';
import { Button } from '../../../../components/Button';
import { Gauge, CheckCircle2 } from 'lucide-react';

export default function ProviderLimitsPage() {
  const [dailyLimit, setDailyLimit] = useState(1000000);
  const [monthlyLimit, setMonthlyLimit] = useState(30000000);
  const [requestLimit, setRequestLimit] = useState(8192);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <AiStudioHeader
          title="Controle de Limites Diários & Mensais"
          subtitle="Defina cotas máximas de tokens, orçamento mensal em USD e limites por requisição."
          activeTab="Provedores"
        />

        <ProvidersNavigation />

        <form onSubmit={handleSave} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 max-w-2xl text-xs">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Gauge className="text-emerald-600" size={18} /> Limites de Consumo de Tokens por Empresa
          </h4>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Limite Diário de Tokens</label>
            <input
              type="number"
              value={dailyLimit}
              onChange={(e) => setDailyLimit(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-300 p-2.5 font-mono text-slate-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Limite Mensal de Tokens</label>
            <input
              type="number"
              value={monthlyLimit}
              onChange={(e) => setMonthlyLimit(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-300 p-2.5 font-mono text-slate-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Limite por Requisição (Tokens)</label>
            <input
              type="number"
              value={requestLimit}
              onChange={(e) => setRequestLimit(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-300 p-2.5 font-mono text-slate-900"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" variant="primary" leftIcon={<Gauge size={16} />}>
              Salvar Limites
            </Button>
            {saved && (
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 size={16} /> Limites atualizados!
              </span>
            )}
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
