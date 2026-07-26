'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { Card } from '../../../components/Card';
import { Badge } from '../../../components/Badge';
import { api } from '../../../services/api';
import { CreditCard, Building, Calendar, DollarSign } from 'lucide-react';

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const res = await api.get('/admin/subscriptions');
        setSubscriptions(res.data || []);
      } catch (err) {
        console.error('Erro ao buscar assinaturas globais:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscriptions();
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="text-emerald-600" /> Gestão Global de Assinaturas SaaS
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Relatório consolidado de todas as assinaturas contratadas na plataforma.
            </p>
          </div>
        </div>

        {/* Tabela de Assinaturas */}
        <Card className="p-0 overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-xs text-slate-500">Carregando relatório de assinaturas...</div>
          ) : subscriptions.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400">Nenhuma assinatura registrada no momento.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                    <th className="p-3.5">Empresa Cliente</th>
                    <th className="p-3.5">CNPJ</th>
                    <th className="p-3.5">Plano</th>
                    <th className="p-3.5">Valor Mensal</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Próxima Cobrança</th>
                    <th className="p-3.5 text-right">Gateway</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {subscriptions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5">
                        <strong className="block text-slate-900 font-semibold">{sub.company?.name}</strong>
                        <span className="text-[11px] text-slate-400">{sub.company?.email}</span>
                      </td>
                      <td className="p-3.5 font-mono text-slate-600">{sub.company?.document}</td>
                      <td className="p-3.5">
                        <Badge variant="blue">{sub.plan?.name}</Badge>
                      </td>
                      <td className="p-3.5 font-bold text-emerald-600 font-mono">
                        {formatCurrency(sub.plan?.price)}
                      </td>
                      <td className="p-3.5">
                        <Badge variant={sub.status === 'ACTIVE' ? 'green' : 'red'}>
                          {sub.status === 'ACTIVE' ? 'Ativa 🟢' : sub.status}
                        </Badge>
                      </td>
                      <td className="p-3.5 font-mono text-slate-600">
                        {new Date(sub.nextBillingDate).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="p-3.5 text-right font-mono text-slate-500">
                        {sub.paymentProvider || 'SIMULATED'}
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
