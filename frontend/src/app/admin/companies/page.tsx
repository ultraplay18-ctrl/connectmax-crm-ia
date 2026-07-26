'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { Badge } from '../../../components/Badge';
import { api } from '../../../services/api';
import {
  Building,
  Search,
  Filter,
  ShieldAlert,
  ShieldCheck,
  CreditCard,
  Users,
  X,
  CheckCircle2,
} from 'lucide-react';

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modal Alterar Plano
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [targetPlanId, setTargetPlanId] = useState('');
  const [modalLoading, setModalLoading] = useState(false);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const [compRes, plansRes] = await Promise.all([
        api.get(`/admin/companies?search=${search}&status=${statusFilter}`),
        api.get('/subscriptions/plans'),
      ]);

      setCompanies(compRes.data || []);
      setPlans(plansRes.data || []);
    } catch (err) {
      console.error('Erro ao buscar empresas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [search, statusFilter]);

  const handleToggleStatus = async (company: any) => {
    const nextStatus = company.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    const actionText = nextStatus === 'SUSPENDED' ? 'BLOQUEAR' : 'DESBLOQUEAR';
    if (!window.confirm(`Tem certeza que deseja ${actionText} a empresa "${company.name}"?`)) return;

    try {
      await api.patch(`/admin/companies/${company.id}/status`, { status: nextStatus });
      fetchCompanies();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao alterar status da empresa.');
    }
  };

  const handleOpenPlanModal = (company: any) => {
    setSelectedCompany(company);
    setTargetPlanId(company.subscription?.planId || '');
  };

  const handleUpdatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompany || !targetPlanId) return;

    setModalLoading(true);
    try {
      await api.patch(`/admin/companies/${selectedCompany.id}/plan`, { planId: targetPlanId });
      setSelectedCompany(null);
      fetchCompanies();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao alterar plano da empresa.');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Building className="text-brand-500" /> Gestão de Empresas (Tenants SaaS)
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Painel de controle global: gerencie o acesso, altere planos comerciais e controle bloqueios das empresas clientes.
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm text-xs">
          <div className="w-full sm:w-80">
            <Input
              placeholder="Buscar por nome, CNPJ ou e-mail..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search size={14} className="text-slate-400" />}
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-slate-400" />
              <span className="font-semibold text-slate-700">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-2 py-1 focus:outline-none"
              >
                <option value="">Todos os Status</option>
                <option value="ACTIVE">Ativas 🟢</option>
                <option value="SUSPENDED">Bloqueadas 🛑</option>
              </select>
            </div>

            <span className="text-slate-500">Total: <strong>{companies.length}</strong> empresa(s)</span>
          </div>
        </div>

        {/* Tabela de Empresas */}
        <Card className="p-0 overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-xs text-slate-500">Carregando lista de empresas...</div>
          ) : companies.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400">Nenhuma empresa encontrada com os filtros.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                    <th className="p-3.5">Empresa</th>
                    <th className="p-3.5">CNPJ</th>
                    <th className="p-3.5">Plano Ativo</th>
                    <th className="p-3.5">Usuários</th>
                    <th className="p-3.5">Contatos</th>
                    <th className="p-3.5">Status Access</th>
                    <th className="p-3.5 text-right">Ações Super Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {companies.map((company) => (
                    <tr key={company.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5">
                        <strong className="block text-slate-900 text-sm font-semibold">{company.name}</strong>
                        <span className="text-[11px] text-slate-400">{company.email}</span>
                      </td>
                      <td className="p-3.5 font-mono text-slate-600">{company.document}</td>
                      <td className="p-3.5">
                        <Badge variant="blue">
                          {company.subscription?.plan?.name || 'Starter'}
                        </Badge>
                      </td>
                      <td className="p-3.5 font-mono text-slate-700 font-semibold">{company._count?.users || 0}</td>
                      <td className="p-3.5 font-mono text-slate-700 font-semibold">{company._count?.contacts || 0}</td>
                      <td className="p-3.5">
                        <Badge variant={company.status === 'ACTIVE' ? 'green' : 'red'}>
                          {company.status === 'ACTIVE' ? 'Ativa 🟢' : 'Bloqueada 🛑'}
                        </Badge>
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => handleOpenPlanModal(company)}
                          className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold transition-colors"
                        >
                          Alterar Plano
                        </button>
                        <button
                          onClick={() => handleToggleStatus(company)}
                          className={`px-2.5 py-1 rounded font-semibold text-white transition-colors ${
                            company.status === 'ACTIVE'
                              ? 'bg-rose-600 hover:bg-rose-700'
                              : 'bg-emerald-600 hover:bg-emerald-700'
                          }`}
                        >
                          {company.status === 'ACTIVE' ? 'Bloquear' : 'Desbloquear'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Modal Alterar Plano */}
        {selectedCompany && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CreditCard className="text-brand-500" /> Alterar Plano da Empresa
                </h3>
                <button onClick={() => setSelectedCompany(null)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              <div className="text-xs space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <p><strong>Empresa:</strong> {selectedCompany.name}</p>
                <p><strong>Plano Atual:</strong> {selectedCompany.subscription?.plan?.name || 'Starter'}</p>
              </div>

              <form onSubmit={handleUpdatePlan} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider">Novo Plano Comercial</label>
                  <select
                    value={targetPlanId}
                    onChange={(e) => setTargetPlanId(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs focus:outline-none"
                    required
                  >
                    <option value="">Selecione o Plano</option>
                    {plans.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} - R$ {p.price}/mês
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => setSelectedCompany(null)}>
                    Cancelar
                  </Button>
                  <Button type="submit" variant="primary" size="sm" isLoading={modalLoading}>
                    Confirmar Alteração
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
