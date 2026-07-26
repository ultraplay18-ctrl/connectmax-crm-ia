'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';
import { AiStudioHeader } from '../../../../components/ai-studio/AiStudioHeader';
import { PlaygroundNavigation } from '../../../../components/ai-studio/PlaygroundNavigation';
import { BookOpen, CheckCircle2, FileText } from 'lucide-react';

export default function PlaygroundKnowledgePage() {
  const [selectedLibs, setSelectedLibs] = useState<string[]>(['Produtos', 'Financeiro']);

  const libraries = [
    { id: 'Produtos', name: 'Catálogo de Produtos 2026', docs: 14 },
    { id: 'Financeiro', name: 'Políticas de Faturamento & Cobrança', docs: 8 },
    { id: 'RH', name: 'Manuais Internos de Benefícios', docs: 6 },
    { id: 'Jurídico', name: 'Termos de Uso & Contratos', docs: 5 },
  ];

  const toggleLib = (id: string) => {
    setSelectedLibs((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <AiStudioHeader
          title="Seletor do Knowledge Hub"
          subtitle="Selecione quais bibliotecas de conhecimento o agente consultará durante o teste."
          activeTab="Playground"
        />

        <PlaygroundNavigation />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {libraries.map((lib) => {
            const active = selectedLibs.includes(lib.id);
            return (
              <div
                key={lib.id}
                onClick={() => toggleLib(lib.id)}
                className={`p-5 rounded-3xl border cursor-pointer transition-all space-y-3 ${
                  active
                    ? 'border-indigo-500 bg-indigo-50/50 shadow-md'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className={active ? 'text-indigo-600' : 'text-slate-400'} size={20} />
                    <h4 className="font-bold text-slate-900 text-sm">{lib.name}</h4>
                  </div>
                  {active && <CheckCircle2 className="text-indigo-600" size={18} />}
                </div>
                <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                  <FileText size={14} /> {lib.docs} documentos indexados
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
