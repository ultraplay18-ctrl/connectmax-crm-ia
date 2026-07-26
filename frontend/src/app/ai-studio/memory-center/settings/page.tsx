'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';
import { AiStudioHeader } from '../../../../components/ai-studio/AiStudioHeader';
import { MemoryCenterNavigation } from '../../../../components/ai-studio/MemoryCenterNavigation';
import { Button } from '../../../../components/Button';
import { Settings, ShieldCheck, Brain, CheckCircle2 } from 'lucide-react';

export default function MemorySettingsPage() {
  const [retentionDays, setRetentionDays] = useState(365);
  const [contextWindowSize, setContextWindowSize] = useState(128000);
  const [sharedMemory, setSharedMemory] = useState(true);
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
          title="Configurações de Retenção de Memória"
          subtitle="Ajuste o período de guarda, janela de contexto máxima e políticas de compartilhamento."
          activeTab="Memória"
        />

        <MemoryCenterNavigation />

        <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Brain className="text-purple-600" size={18} /> Parâmetros de Retenção
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Período de Retenção (Dias)</label>
                <input
                  type="number"
                  value={retentionDays}
                  onChange={(e) => setRetentionDays(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 p-2.5 font-mono text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Tamanho da Janela de Contexto (Tokens)</label>
                <input
                  type="number"
                  value={contextWindowSize}
                  onChange={(e) => setContextWindowSize(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 p-2.5 font-mono text-slate-900"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <ShieldCheck className="text-emerald-600" size={18} /> Compartilhamento Multi-Agente
            </h4>
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <span className="font-bold text-xs text-slate-900 block">Habilitar Memória Compartilhada (Shared Memory)</span>
                <span className="text-[11px] text-slate-500">Permite que SDR, Suporte e Finanças acessem o histórico autorizado.</span>
              </div>
              <input
                type="checkbox"
                checked={sharedMemory}
                onChange={(e) => setSharedMemory(e.target.checked)}
                className="h-5 w-5 rounded text-purple-600 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" variant="primary" leftIcon={<Settings size={18} />}>
              Salvar Configurações
            </Button>
            {saved && (
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 size={16} /> Configurações salvas com sucesso!
              </span>
            )}
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
