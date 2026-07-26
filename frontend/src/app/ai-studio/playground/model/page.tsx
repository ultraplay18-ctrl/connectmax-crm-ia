'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';
import { AiStudioHeader } from '../../../../components/ai-studio/AiStudioHeader';
import { PlaygroundNavigation } from '../../../../components/ai-studio/PlaygroundNavigation';
import { Button } from '../../../../components/Button';
import { Cpu, CheckCircle2 } from 'lucide-react';

export default function PlaygroundModelPage() {
  const [provider, setProvider] = useState('OpenAI');
  const [modelName, setModelName] = useState('gpt-4o');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [saved, setSaved] = useState(false);

  const providers = ['OpenAI', 'Anthropic Claude', 'Google Gemini', 'DeepSeek', 'Grok', 'Ollama (Local)', 'OpenRouter'];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <AiStudioHeader
          title="Seletor de Provedor & Modelo de IA"
          subtitle="Escolha entre os 7 provedores suportados e configure temperatura e limites de tokens."
          activeTab="Playground"
        />

        <PlaygroundNavigation />

        <form onSubmit={handleSave} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6 max-w-2xl">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">Provedor de LLM</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {providers.map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setProvider(p)}
                  className={`p-3 rounded-2xl text-xs font-bold border transition-all ${
                    provider === p
                      ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Nome do Modelo</label>
              <input
                type="text"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 font-mono text-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Temperatura ({temperature})</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-500 mt-3"
              />
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <label className="font-semibold text-slate-700">Limite Máximo de Tokens de Saída</label>
            <input
              type="number"
              value={maxTokens}
              onChange={(e) => setMaxTokens(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-300 p-2.5 font-mono text-slate-900"
            />
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" variant="primary" leftIcon={<Cpu size={16} />}>
              Aplicar Parâmetros ao Playground
            </Button>
            {saved && (
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 size={16} /> Parâmetros aplicados!
              </span>
            )}
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
