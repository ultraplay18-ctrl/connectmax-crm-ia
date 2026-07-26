'use client';

import React from 'react';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';
import { AiStudioHeader } from '../../../../components/ai-studio/AiStudioHeader';
import { ProvidersNavigation } from '../../../../components/ai-studio/ProvidersNavigation';
import { Layers, CheckCircle2 } from 'lucide-react';

export default function ProviderModelsPage() {
  const models = [
    { slug: 'gpt-4o', name: 'OpenAI GPT-4o', provider: 'OpenAI', context: '128.000 tokens', maxOutput: '4.096 tokens' },
    { slug: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', context: '200.000 tokens', maxOutput: '8.192 tokens' },
    { slug: 'gemini-1.5-pro', name: 'Google Gemini 1.5 Pro', provider: 'Google', context: '1.000.000 tokens', maxOutput: '8.192 tokens' },
    { slug: 'deepseek-chat', name: 'DeepSeek Chat V3', provider: 'DeepSeek', context: '64.000 tokens', maxOutput: '4.096 tokens' },
    { slug: 'grok-beta', name: 'xAI Grok Beta', provider: 'xAI', context: '128.000 tokens', maxOutput: '4.096 tokens' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <AiStudioHeader
          title="Catálogo de Modelos Habilitados"
          subtitle="Visualize a janela de contexto e limites de output dos modelos de IA por empresa."
          activeTab="Provedores"
        />

        <ProvidersNavigation />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {models.map((mod) => (
            <div key={mod.slug} className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="text-emerald-600" size={18} />
                  <h4 className="font-bold text-slate-900 text-sm">{mod.name}</h4>
                </div>
                <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                  {mod.provider}
                </span>
              </div>
              <div className="text-xs text-slate-600 space-y-1 font-mono">
                <div>Janela de Contexto: {mod.context}</div>
                <div>Tokens Máximos de Saída: {mod.maxOutput}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
