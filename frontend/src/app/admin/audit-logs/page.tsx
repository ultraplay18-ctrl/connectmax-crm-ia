'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { Card } from '../../../components/Card';
import { Input } from '../../../components/Input';
import { Badge } from '../../../components/Badge';
import { api } from '../../../services/api';
import { ShieldCheck, Search, Building, User, Clock } from 'lucide-react';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/audit-logs?search=${search}`);
      setLogs(res.data || []);
    } catch (err) {
      console.error('Erro ao carregar logs de auditoria:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [search]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="text-indigo-600" /> Logs Globais de Auditoria (Super Admin)
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Rastreamento de auditoria e segurança em nível global de todas as empresas e usuários do SaaS.
            </p>
          </div>
        </div>

        {/* Filtro de Busca */}
        <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm text-xs flex items-center justify-between">
          <div className="w-full sm:w-96">
            <Input
              placeholder="Buscar por ação ou entidade (Ex: USER_CREATE)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search size={14} className="text-slate-400" />}
            />
          </div>
          <span className="text-slate-500">Exibindo os últimos <strong>{logs.length}</strong> eventos</span>
        </div>

        {/* Tabela de Logs */}
        <Card className="p-0 overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-xs text-slate-500">Carregando logs de auditoria...</div>
          ) : logs.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400">Nenhum evento registrado.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                    <th className="p-3.5">Data & Hora</th>
                    <th className="p-3.5">Empresa Tenant</th>
                    <th className="p-3.5">Usuário Autor</th>
                    <th className="p-3.5">Ação</th>
                    <th className="p-3.5">Entidade</th>
                    <th className="p-3.5 text-right">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 text-slate-500">
                        {new Date(log.createdAt).toLocaleString('pt-BR')}
                      </td>
                      <td className="p-3.5 font-sans font-semibold text-slate-900">
                        {log.company?.name || 'Sistema / Global'}
                      </td>
                      <td className="p-3.5 font-sans text-slate-600">
                        {log.user?.name || log.user?.email || 'Sistema (Bot/IA)'}
                      </td>
                      <td className="p-3.5 font-sans">
                        <Badge variant="blue">{log.action}</Badge>
                      </td>
                      <td className="p-3.5 text-slate-700 font-semibold">{log.entity}</td>
                      <td className="p-3.5 text-right text-slate-400">{log.ipAddress || '127.0.0.1'}</td>
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
