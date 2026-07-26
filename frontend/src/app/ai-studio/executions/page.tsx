'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { AiStudioHeader } from '../../../components/ai-studio/AiStudioHeader';
import { AiStudioNavigation } from '../../../components/ai-studio/AiStudioNavigation';
import { Badge } from '../../../components/Badge';
import { api } from '../../../services/api';
import { Play, Bot, Clock, Coins, CheckCircle2, Cpu } from 'lucide-react';

export default function AgentExecutionsPage() {
  const [executions, setExecutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExecutions = async () => {
    setLoading(true);
    try {
      const response = await api.get('/ai-studio/executions');
      setExecutions(response.data || []);
    } catch (err) {
      console.error('Erro ao buscar execuções:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExecutions();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <AiStudioHeader
          title="Histórico de Execuções e Consumo de Tokens"
          subtitle="Métricas de tempo de resposta, modelos utilizados e contagem de tokens."
          activeTab="Execuções"
        />

        <AiStudioNavigation />

        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Play className="text-brand-500" size={18} /> Registro de Execuções Recentes
          </h3>

          {loading ? (
            <div className="py-12 text-center text-slate-400 text-xs">Carregando histórico de execuções...</div>
          ) : executions.length === 0 ? (
            <div className="py-12 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50 text-slate-400 text-xs space-y-2">
              <Bot size={28} className="mx-auto text-slate-300" />
              <p className="font-medium">Nenhuma execução registrada.</p>
              <p className="text-[11px] text-slate-400">As chamadas aos agentes de IA serão registradas automaticamente aqui.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-600 font-semibold">
                    <th className="p-3">Data/Hora</th>
                    <th className="p-3">Agente</th>
                    <th className="p-3">Provedor / Modelo</th>
                    <th className="p-3">Tokens Entrada</th>
                    <th className="p-3">Tokens Saída</th>
                    <th className="p-3">Total Tokens</th>
                    <th className="p-3">Tempo (ms)</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {executions.map((exec) => (
                    <tr key={exec.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-mono text-slate-500">
                        {new Date(exec.createdAt).toLocaleString('pt-BR')}
                      </td>
                      <td className="p-3 font-semibold text-slate-900 flex items-center gap-2">
                        <Bot size={16} className="text-brand-500" />
                        {exec.agent?.name || 'Agente IA'}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-slate-100 text-slate-700">
                          {exec.provider} ({exec.modelName})
                        </span>
                      </td>
                      <td className="p-3 font-mono text-slate-600">{exec.promptTokens}</td>
                      <td className="p-3 font-mono text-slate-600">{exec.completionTokens}</td>
                      <td className="p-3 font-mono font-bold text-brand-600">{exec.totalTokens}</td>
                      <td className="p-3 font-mono text-slate-600">{exec.executionTimeMs}ms</td>
                      <td className="p-3">
                        <Badge variant="green">{exec.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
