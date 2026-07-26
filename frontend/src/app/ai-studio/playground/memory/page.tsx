'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';
import { AiStudioHeader } from '../../../../components/ai-studio/AiStudioHeader';
import { PlaygroundNavigation } from '../../../../components/ai-studio/PlaygroundNavigation';
import { Brain, CheckCircle2 } from 'lucide-react';

export default function PlaygroundMemoryPage() {
  const [selectedMemories, setSelectedMemories] = useState<string[]>([
    'Short Term Memory',
    'Long Term Memory',
    'Customer Memory',
    'Shared Memory',
  ]);

  const memoryTypes = [
    { id: 'Short Term Memory', desc: 'Janela de conversa ativa atual.' },
    { id: 'Long Term Memory', desc: 'Histórico mantido entre múltiplas sessões.' },
    { id: 'Session Memory', desc: 'Variáveis temporárias e chaves de estado.' },
    { id: 'Customer Memory', desc: 'Preferências e histórico do perfil de cliente.' },
    { id: 'Shared Memory', desc: 'Histórico compartilhado entre SDR, Suporte e Finanças.' },
    { id: 'Agent Memory', desc: 'Memória de aprendizado individual do agente.' },
  ];

  const toggleMemory = (id: string) => {
    setSelectedMemories((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <AiStudioHeader
          title="Seletor do Memory Center"
          subtitle="Ative os motores de memória (Short, Long, Shared, Customer, Session, Agent) para o teste."
          activeTab="Playground"
        />

        <PlaygroundNavigation />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {memoryTypes.map((mem) => {
            const active = selectedMemories.includes(mem.id);
            return (
              <div
                key={mem.id}
                onClick={() => toggleMemory(mem.id)}
                className={`p-5 rounded-3xl border cursor-pointer transition-all space-y-3 ${
                  active
                    ? 'border-purple-500 bg-purple-50/50 shadow-md'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className={active ? 'text-purple-600' : 'text-slate-400'} size={20} />
                    <h4 className="font-bold text-slate-900 text-sm">{mem.id}</h4>
                  </div>
                  {active && <CheckCircle2 className="text-purple-600" size={18} />}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{mem.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
