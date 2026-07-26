'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';
import { AiStudioHeader } from '../../../../components/ai-studio/AiStudioHeader';
import { ProvidersNavigation } from '../../../../components/ai-studio/ProvidersNavigation';
import { api } from '../../../../services/api';
import { ShieldCheck, Key, User, Calendar } from 'lucide-react';

export default function SecretsAuditPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    try {
      const res = await api.get('/ai-studio/secrets/audit');
      setLogs(res.data || []);
    } catch (err) {
      console.error('Erro ao carregar logs de auditoria:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <AiStudioHeader
          title="Auditoria de Segurança do Cofre (Secret Audit Logs)"
          subtitle="Registro de quem criou, editou ou removeu credenciais criptografadas no cofre."
          activeTab="Provedores"
        />

        <ProvidersNavigation />

        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs">Carregando logs de auditoria...</div>
        ) : logs.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center text-xs text-slate-500 max-w-md mx-auto">
            Nenhum evento de auditoria registrado no cofre ainda.
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden text-xs">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                <tr>
                  <th className="p-4">Ação</th>
                  <th className="p-4">Chave</th>
                  <th className="p-4">Usuário / Ator</th>
                  <th className="p-4">Detalhes</th>
                  <th className="p-4 text-right">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold">
                      <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-mono border border-purple-200">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-900 flex items-center gap-2">
                      <Key size={14} className="text-emerald-600" /> {log.keyName}
                    </td>
                    <td className="p-4 text-slate-700">{log.actorUser || 'Sistema'}</td>
                    <td className="p-4 text-slate-600">{log.details}</td>
                    <td className="p-4 text-right text-slate-400 font-mono">
                      {new Date(log.createdAt).toLocaleString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
