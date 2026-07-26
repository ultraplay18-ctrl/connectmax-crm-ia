'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';
import { AiStudioHeader } from '../../../../components/ai-studio/AiStudioHeader';
import { PlaygroundNavigation } from '../../../../components/ai-studio/PlaygroundNavigation';
import { Button } from '../../../../components/Button';
import { Settings, CheckCircle2 } from 'lucide-react';

export default function PlaygroundSettingsPage() {
  const [autoSavePresets, setAutoSavePresets] = useState(true);
  const [mockProviderCalls, setMockProviderCalls] = useState(true);
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
          title="Configurações do AI Playground"
          subtitle="Ajuste o comportamento do ambiente de testes e simulações do laboratório."
          activeTab="Playground"
        />

        <PlaygroundNavigation />

        <form onSubmit={handleSave} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 max-w-2xl">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Settings className="text-slate-700" size={18} /> Opções de Simulação
          </h4>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <span className="font-bold text-slate-900 block">Simulação de Chamadas (Sem consumo de API externa)</span>
                <span className="text-slate-500">Mantém a execução 100% segura usando o motor sintético do Runtime Engine.</span>
              </div>
              <input
                type="checkbox"
                checked={mockProviderCalls}
                onChange={(e) => setMockProviderCalls(e.target.checked)}
                className="h-5 w-5 rounded text-brand-600 focus:ring-brand-500"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <span className="font-bold text-slate-900 block">Auto-salvamento de Presets</span>
                <span className="text-slate-500">Salva automaticamente alterações de System Prompt em rascunhos.</span>
              </div>
              <input
                type="checkbox"
                checked={autoSavePresets}
                onChange={(e) => setAutoSavePresets(e.target.checked)}
                className="h-5 w-5 rounded text-brand-600 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" variant="primary" leftIcon={<Settings size={16} />}>
              Salvar Preferências
            </Button>
            {saved && (
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 size={16} /> Configurações salvas!
              </span>
            )}
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
