'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';
import { AiStudioHeader } from '../../../../components/ai-studio/AiStudioHeader';
import { PlaygroundNavigation } from '../../../../components/ai-studio/PlaygroundNavigation';
import { Wrench, CheckCircle2 } from 'lucide-react';

export default function PlaygroundToolsPage() {
  const [selectedTools, setSelectedTools] = useState<string[]>([
    'CRM Tool',
    'Financeiro Tool',
    'Agenda Tool',
    'WhatsApp Tool',
    'Knowledge Tool',
    'Memory Tool',
  ]);

  const allTools = [
    { id: 'CRM Tool', desc: 'Consulta e atualização de leads e oportunidades.' },
    { id: 'Financeiro Tool', desc: 'Consulta de faturas, links de pagamento e boletos.' },
    { id: 'Agenda Tool', desc: 'Verificação de horários vagos e agendamentos.' },
    { id: 'WhatsApp Tool', desc: 'Envio e recepção de mensagens via WhatsApp API.' },
    { id: 'Email Tool', desc: 'Envio de e-mails transacionais e propostas.' },
    { id: 'Webhook Tool', desc: 'Disparo de gatilhos HTTP para sistemas externos.' },
    { id: 'API Tool', desc: 'Consumo de endpoints REST autorizados.' },
    { id: 'Database Tool', desc: 'Consultas seguras em bancos PostgreSQL/MySQL.' },
    { id: 'Knowledge Tool', desc: 'Busca semântica no Knowledge Hub.' },
    { id: 'Memory Tool', desc: 'Gravação e leitura de memórias no Memory Center.' },
    { id: 'MCP Tool', desc: 'Conector Model Context Protocol externo.' },
  ];

  const toggleTool = (id: string) => {
    setSelectedTools((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <AiStudioHeader
          title="Seletor de Ferramentas (Tool Registry)"
          subtitle="Habilite ou desabilite ferramentas para testar a capacidade de decisão do Agente."
          activeTab="Playground"
        />

        <PlaygroundNavigation />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allTools.map((tool) => {
            const active = selectedTools.includes(tool.id);
            return (
              <div
                key={tool.id}
                onClick={() => toggleTool(tool.id)}
                className={`p-5 rounded-3xl border cursor-pointer transition-all space-y-2 ${
                  active
                    ? 'border-brand-500 bg-brand-50/50 shadow-md'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Wrench className={active ? 'text-brand-600' : 'text-slate-400'} size={18} /> {tool.id}
                  </h4>
                  {active && <CheckCircle2 className="text-brand-600" size={18} />}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{tool.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
