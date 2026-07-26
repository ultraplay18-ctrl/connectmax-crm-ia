'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';
import { AiStudioHeader } from '../../../../components/ai-studio/AiStudioHeader';
import { PlaygroundNavigation } from '../../../../components/ai-studio/PlaygroundNavigation';
import { Button } from '../../../../components/Button';
import { FileCode, Save, Sparkles, Eye, CheckCircle2 } from 'lucide-react';

export default function PlaygroundPromptPage() {
  const [promptText, setPromptText] = useState(
    `Você é um Agente Inteligente de Vendas (SDR) do ConnectMax CRM IA.\nSeu objetivo é qualificar leads interessados em soluções de automação e agendar demonstrações.\n\nInstruções:\n- Seja sempre empático, profissional e direto.\n- Utilize as ferramentas de CRM e WhatsApp quando necessário.\n- Mantenha o contexto do cliente no Memory Center.`
  );
  const [saved, setSaved] = useState(false);
  const [version, setVersion] = useState(1);

  const handleSaveVersion = (e: React.FormEvent) => {
    e.preventDefault();
    setVersion((v) => v + 1);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <AiStudioHeader
          title="Editor de Prompts em Tempo Real"
          subtitle="Edite e visualize a compilação do System Prompt com injeção de RAG e memória."
          activeTab="Playground"
        />

        <PlaygroundNavigation />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor */}
          <form onSubmit={handleSaveVersion} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <FileCode className="text-brand-500" size={18} /> Editar System Prompt
              </h4>
              <span className="text-xs font-mono font-bold bg-brand-50 text-brand-700 px-2.5 py-0.5 rounded border border-brand-200">
                Versão Atual: v{version}.0
              </span>
            </div>

            <textarea
              rows={12}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 p-4 text-xs font-mono text-slate-900 leading-relaxed focus:ring-2 focus:ring-brand-500"
            />

            <div className="flex items-center justify-between pt-2">
              <Button type="submit" variant="primary" leftIcon={<Save size={16} />}>
                Salvar Nova Versão (v{version + 1}.0)
              </Button>
              {saved && (
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 size={16} /> Versão v{version}.0 salva!
                </span>
              )}
            </div>
          </form>

          {/* Visualizador do Prompt Compilado */}
          <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <h4 className="font-bold text-sm flex items-center gap-2 text-brand-300">
              <Eye size={18} /> Visualização do Prompt Compilado Final (Runtime RAG + Memory)
            </h4>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap h-[340px] overflow-y-auto">
              {`${promptText}\n\n[INJEÇÃO DO KNOWLEDGE HUB RAG]:\n- Documento: Manual de Produtos 2026.pdf (Chunk #4)\n\n[INJEÇÃO DO MEMORY CENTER]:\n- Cliente: Carlos Eduardo | Preferência: Atendimento via WhatsApp.`}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
