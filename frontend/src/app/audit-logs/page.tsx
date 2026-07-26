'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { api } from '../../services/api';
import { ShieldAlert, RefreshCw, User, Building, Clock, Activity } from 'lucide-react';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/audit-logs');
      setLogs(response.data || []);
    } catch (err) {
      console.error('Erro ao buscar logs de auditoria:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getActionBadge = (action: string) => {
    if (action.includes('REGISTER') || action.includes('CREATE')) return <Badge variant="green">{action}</Badge>;
    if (action.includes('LOGIN')) return <Badge variant="blue">{action}</Badge>;
    if (action.includes('UPDATE')) return <Badge variant="amber">{action}</Badge>;
    return <Badge variant="slate">{action}</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="text-brand-500" /> Logs de Auditoria Administrativa
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Rastreabilidade de todas as ações críticas realizadas na plataforma ConnectMax.
            </p>
          </div>
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Atualizar Logs
          </button>
        </div>

        <Card>
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-500">Carregando eventos de auditoria...</div>
          ) : logs.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">Nenhum evento registrado até o momento.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-4 py-3">Ação</th>
                    <th className="px-4 py-3">Entidade</th>
                    <th className="px-4 py-3">Usuário</th>
                    <th className="px-4 py-3">Empresa</th>
                    <th className="px-4 py-3">Data/Hora</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3.5 font-medium text-slate-900">
                        {getActionBadge(log.action)}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-slate-700">{log.entity}</td>
                      <td className="px-4 py-3.5">
                        {log.user ? (
                          <div>
                            <p className="font-semibold text-slate-900">{log.user.name}</p>
                            <p className="text-[11px] text-slate-400">{log.user.email}</p>
                          </div>
                        ) : (
                          <span className="text-slate-400">Sistema / Anônimo</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        {log.company ? log.company.name : <span className="text-slate-400">Global</span>}
                      </td>
                      <td className="px-4 py-3.5 text-slate-500 font-mono">
                        {new Date(log.createdAt).toLocaleString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
