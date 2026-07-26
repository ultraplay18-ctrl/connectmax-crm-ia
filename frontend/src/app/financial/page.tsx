'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Badge } from '../../components/Badge';
import { StatsCard } from '../../components/StatsCard';
import { api } from '../../services/api';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Plus,
  Calendar,
  Building,
  CheckCircle2,
  AlertCircle,
  X,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
  Tag,
} from 'lucide-react';

export default function FinancialPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'receivables' | 'payables'>('overview');
  const [summary, setSummary] = useState<any>({
    totalReceivablesPaid: 0,
    totalPayablesPaid: 0,
    netBalance: 0,
    totalPendingReceivables: 0,
    totalOverdueReceivables: 0,
    totalPendingPayables: 0,
  });
  const [receivables, setReceivables] = useState<any[]>([]);
  const [payables, setPayables] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [receivableStatus, setReceivableStatus] = useState('');
  const [payableStatus, setPayableStatus] = useState('');

  // Modais
  const [isReceivableModalOpen, setIsReceivableModalOpen] = useState(false);
  const [isPayableModalOpen, setIsPayableModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  // Forms
  const [newReceivable, setNewReceivable] = useState({
    description: '',
    amount: '',
    dueDate: new Date().toISOString().substring(0, 10),
    contactId: '',
    status: 'PENDING',
  });

  const [newPayable, setNewPayable] = useState({
    supplier: '',
    category: 'Infraestrutura',
    description: '',
    amount: '',
    dueDate: new Date().toISOString().substring(0, 10),
    status: 'PENDING',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [summaryRes, receivablesRes, payablesRes, contactsRes] = await Promise.all([
        api.get('/financial/summary'),
        api.get(`/financial/receivables${receivableStatus ? `?status=${receivableStatus}` : ''}`),
        api.get(`/financial/payables${payableStatus ? `?status=${payableStatus}` : ''}`),
        api.get('/contacts'),
      ]);

      setSummary(summaryRes.data || {});
      setReceivables(receivablesRes.data || []);
      setPayables(payablesRes.data || []);
      setContacts(contactsRes.data || []);
    } catch (err) {
      console.error('Erro ao buscar dados financeiros:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [receivableStatus, payableStatus]);

  const handleCreateReceivable = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');
    if (!newReceivable.description || !newReceivable.amount || !newReceivable.dueDate) {
      setModalError('Descrição, valor e vencimento são obrigatórios.');
      return;
    }

    setModalLoading(true);
    try {
      await api.post('/financial/receivables', {
        ...newReceivable,
        amount: parseFloat(newReceivable.amount),
        paymentDate: newReceivable.status === 'PAID' ? new Date().toISOString() : null,
      });

      setIsReceivableModalOpen(false);
      setNewReceivable({
        description: '',
        amount: '',
        dueDate: new Date().toISOString().substring(0, 10),
        contactId: '',
        status: 'PENDING',
      });
      fetchData();
    } catch (err: any) {
      setModalError(err.response?.data?.message || 'Erro ao criar conta a receber.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleCreatePayable = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');
    if (!newPayable.supplier || !newPayable.description || !newPayable.amount || !newPayable.dueDate) {
      setModalError('Fornecedor, descrição, valor e vencimento são obrigatórios.');
      return;
    }

    setModalLoading(true);
    try {
      await api.post('/financial/payables', {
        ...newPayable,
        amount: parseFloat(newPayable.amount),
        paymentDate: newPayable.status === 'PAID' ? new Date().toISOString() : null,
      });

      setIsPayableModalOpen(false);
      setNewPayable({
        supplier: '',
        category: 'Infraestrutura',
        description: '',
        amount: '',
        dueDate: new Date().toISOString().substring(0, 10),
        status: 'PENDING',
      });
      fetchData();
    } catch (err: any) {
      setModalError(err.response?.data?.message || 'Erro ao criar conta a pagar.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleToggleReceivableStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'PAID' ? 'PENDING' : 'PAID';
    try {
      await api.patch(`/financial/receivables/${id}`, {
        status: nextStatus,
        paymentDate: nextStatus === 'PAID' ? new Date().toISOString() : null,
      });
      fetchData();
    } catch (err) {
      console.error('Erro ao dar baixa:', err);
    }
  };

  const handleTogglePayableStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'PAID' ? 'PENDING' : 'PAID';
    try {
      await api.patch(`/financial/payables/${id}`, {
        status: nextStatus,
        paymentDate: nextStatus === 'PAID' ? new Date().toISOString() : null,
      });
      fetchData();
    } catch (err) {
      console.error('Erro ao pagar conta:', err);
    }
  };

  const handleDeleteReceivable = async (id: string) => {
    if (!window.confirm('Excluir este lançamento de recebível?')) return;
    try {
      await api.delete(`/financial/receivables/${id}`);
      fetchData();
    } catch (err) {
      console.error('Erro ao excluir recebível:', err);
    }
  };

  const handleDeletePayable = async (id: string) => {
    if (!window.confirm('Excluir este lançamento de despesa?')) return;
    try {
      await api.delete(`/financial/payables/${id}`);
      fetchData();
    } catch (err) {
      console.error('Erro ao excluir despesa:', err);
    }
  };

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
              <DollarSign className="text-brand-500" /> Financeiro CRM & Fluxo de Caixa
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Controle contas a receber, contas a pagar e acompanhe o resultado operacional da sua empresa.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" leftIcon={<Plus size={16} />} onClick={() => setIsPayableModalOpen(true)}>
              Nova Conta a Pagar
            </Button>
            <Button variant="primary" size="sm" leftIcon={<Plus size={16} />} onClick={() => setIsReceivableModalOpen(true)}>
              Nova Conta a Receber
            </Button>
          </div>
        </div>

        {/* CARDS DE KPIS FINANCEIROS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Receitas Recebidas"
            value={formatCurrency(summary.totalReceivablesPaid)}
            icon={<ArrowUpRight className="text-emerald-600" size={24} />}
          />
          <StatsCard
            title="Despesas Pagas"
            value={formatCurrency(summary.totalPayablesPaid)}
            icon={<ArrowDownRight className="text-rose-600" size={24} />}
          />
          <StatsCard
            title="Saldo Líquido Operacional"
            value={formatCurrency(summary.netBalance)}
            icon={<DollarSign className={summary.netBalance >= 0 ? 'text-emerald-500' : 'text-rose-500'} size={24} />}
          />
          <StatsCard
            title="A Receber Pendente"
            value={formatCurrency(summary.totalPendingReceivables)}
            icon={<CreditCard className="text-amber-500" size={24} />}
          />
        </div>

        {/* Abas */}
        <div className="border-b border-slate-200 flex items-center gap-6 text-sm font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-brand-500 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Visão Geral & Fluxo de Caixa
          </button>
          <button
            onClick={() => setActiveTab('receivables')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'receivables'
                ? 'border-brand-500 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Contas a Receber ({receivables.length})
          </button>
          <button
            onClick={() => setActiveTab('payables')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'payables'
                ? 'border-brand-500 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Contas a Pagar ({payables.length})
          </button>
        </div>

        {/* ABA VISÃO GERAL */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card title="Resumo do Fluxo de Caixa" className="lg:col-span-2">
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600">
                      <TrendingUp size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase">Total de Entradas Efetivadas</h4>
                      <p className="text-xs text-slate-500">Recebimentos liquidados na conta</p>
                    </div>
                  </div>
                  <span className="text-base font-bold text-emerald-600 font-mono">
                    {formatCurrency(summary.totalReceivablesPaid)}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-rose-500/10 text-rose-600">
                      <TrendingDown size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase">Total de Saídas Efetivadas</h4>
                      <p className="text-xs text-slate-500">Pagamento de fornecedores e despesas</p>
                    </div>
                  </div>
                  <span className="text-base font-bold text-rose-600 font-mono">
                    {formatCurrency(summary.totalPayablesPaid)}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-r from-brand-900 to-slate-900 text-white flex items-center justify-between shadow-md">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Resultado Financeiro Atual</h4>
                    <p className="text-[11px] text-slate-400">Saldo apurado no período</p>
                  </div>
                  <span className={`text-xl font-bold font-mono ${summary.netBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {formatCurrency(summary.netBalance)}
                  </span>
                </div>
              </div>
            </Card>

            <Card title="Previsão de Próximos Vencimentos">
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between">
                  <span>Recebíveis Pendentes</span>
                  <strong className="font-mono">{formatCurrency(summary.totalPendingReceivables)}</strong>
                </div>

                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-900 flex items-center justify-between">
                  <span>Recebíveis Atrasados</span>
                  <strong className="font-mono">{formatCurrency(summary.totalOverdueReceivables)}</strong>
                </div>

                <div className="p-3 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-between">
                  <span>Contas a Pagar Pendentes</span>
                  <strong className="font-mono">{formatCurrency(summary.totalPendingPayables)}</strong>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* ABA CONTAS A RECEBER */}
        {activeTab === 'receivables' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm text-xs">
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-slate-400" />
                <span className="font-semibold text-slate-700">Status:</span>
                <select
                  value={receivableStatus}
                  onChange={(e) => setReceivableStatus(e.target.value)}
                  className="rounded-lg border border-slate-300 bg-white px-2 py-1 focus:outline-none"
                >
                  <option value="">Todos</option>
                  <option value="PENDING">Pendentes</option>
                  <option value="PAID">Pagos / Recebidos</option>
                  <option value="OVERDUE">Atrasados</option>
                </select>
              </div>

              <span className="text-slate-500">Total: <strong>{receivables.length}</strong> registro(s)</span>
            </div>

            <Card className="p-0 overflow-hidden">
              {loading ? (
                <div className="py-16 text-center text-xs text-slate-500">Carregando contas a receber...</div>
              ) : receivables.length === 0 ? (
                <div className="py-16 text-center text-xs text-slate-400">Nenhum lançamento a receber encontrado.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                        <th className="p-3.5">Descrição</th>
                        <th className="p-3.5">Cliente</th>
                        <th className="p-3.5">Vencimento</th>
                        <th className="p-3.5">Valor</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {receivables.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3.5 font-semibold text-slate-900">{item.description}</td>
                          <td className="p-3.5 text-slate-600">{item.contact?.name || 'Cliente Geral'}</td>
                          <td className="p-3.5 font-mono text-slate-500">
                            {new Date(item.dueDate).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="p-3.5 font-bold text-slate-900 font-mono">
                            {formatCurrency(item.amount)}
                          </td>
                          <td className="p-3.5">
                            <Badge
                              variant={
                                item.status === 'PAID' ? 'green' : item.status === 'OVERDUE' ? 'red' : 'amber'
                              }
                            >
                              {item.status === 'PAID' ? 'Pago' : item.status === 'OVERDUE' ? 'Atrasado' : 'Pendente'}
                            </Badge>
                          </td>
                          <td className="p-3.5 text-right space-x-2">
                            <button
                              onClick={() => handleToggleReceivableStatus(item.id, item.status)}
                              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                                item.status === 'PAID'
                                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
                              }`}
                            >
                              {item.status === 'PAID' ? 'Estornar' : 'Dar Baixa'}
                            </button>
                            <button
                              onClick={() => handleDeleteReceivable(item.id)}
                              className="text-slate-400 hover:text-red-600 p-1"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* ABA CONTAS A PAGAR */}
        {activeTab === 'payables' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm text-xs">
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-slate-400" />
                <span className="font-semibold text-slate-700">Status:</span>
                <select
                  value={payableStatus}
                  onChange={(e) => setPayableStatus(e.target.value)}
                  className="rounded-lg border border-slate-300 bg-white px-2 py-1 focus:outline-none"
                >
                  <option value="">Todos</option>
                  <option value="PENDING">Pendentes</option>
                  <option value="PAID">Pagos</option>
                  <option value="OVERDUE">Atrasados</option>
                </select>
              </div>

              <span className="text-slate-500">Total: <strong>{payables.length}</strong> registro(s)</span>
            </div>

            <Card className="p-0 overflow-hidden">
              {loading ? (
                <div className="py-16 text-center text-xs text-slate-500">Carregando contas a pagar...</div>
              ) : payables.length === 0 ? (
                <div className="py-16 text-center text-xs text-slate-400">Nenhum lançamento a pagar encontrado.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                        <th className="p-3.5">Fornecedor</th>
                        <th className="p-3.5">Categoria</th>
                        <th className="p-3.5">Descrição</th>
                        <th className="p-3.5">Vencimento</th>
                        <th className="p-3.5">Valor</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {payables.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3.5 font-semibold text-slate-900">{item.supplier}</td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                              {item.category}
                            </span>
                          </td>
                          <td className="p-3.5 text-slate-600">{item.description}</td>
                          <td className="p-3.5 font-mono text-slate-500">
                            {new Date(item.dueDate).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="p-3.5 font-bold text-rose-600 font-mono">
                            {formatCurrency(item.amount)}
                          </td>
                          <td className="p-3.5">
                            <Badge
                              variant={
                                item.status === 'PAID' ? 'green' : item.status === 'OVERDUE' ? 'red' : 'amber'
                              }
                            >
                              {item.status === 'PAID' ? 'Pago' : item.status === 'OVERDUE' ? 'Atrasado' : 'Pendente'}
                            </Badge>
                          </td>
                          <td className="p-3.5 text-right space-x-2">
                            <button
                              onClick={() => handleTogglePayableStatus(item.id, item.status)}
                              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                                item.status === 'PAID'
                                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
                              }`}
                            >
                              {item.status === 'PAID' ? 'Estornar' : 'Pagar'}
                            </button>
                            <button
                              onClick={() => handleDeletePayable(item.id)}
                              className="text-slate-400 hover:text-red-600 p-1"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Modal Nova Conta a Receber */}
        {isReceivableModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <DollarSign className="text-brand-500" /> Nova Conta a Receber
                </h3>
                <button onClick={() => setIsReceivableModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              {modalError && (
                <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle size={16} /> {modalError}
                </div>
              )}

              <form onSubmit={handleCreateReceivable} className="space-y-4 text-xs">
                <Input
                  label="Descrição *"
                  placeholder="Ex: Mensalidade Software Licenciamento"
                  value={newReceivable.description}
                  onChange={(e) => setNewReceivable({ ...newReceivable, description: e.target.value })}
                  required
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Valor (R$) *"
                    type="number"
                    placeholder="0.00"
                    value={newReceivable.amount}
                    onChange={(e) => setNewReceivable({ ...newReceivable, amount: e.target.value })}
                    required
                  />

                  <Input
                    label="Vencimento *"
                    type="date"
                    value={newReceivable.dueDate}
                    onChange={(e) => setNewReceivable({ ...newReceivable, dueDate: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider">Cliente Vinculado</label>
                  <select
                    value={newReceivable.contactId}
                    onChange={(e) => setNewReceivable({ ...newReceivable, contactId: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs focus:outline-none"
                  >
                    <option value="">Selecione o Cliente</option>
                    {contacts.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider">Status Inicial</label>
                  <select
                    value={newReceivable.status}
                    onChange={(e) => setNewReceivable({ ...newReceivable, status: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs focus:outline-none"
                  >
                    <option value="PENDING">Pendente</option>
                    <option value="PAID">Pago / Recebido</option>
                  </select>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => setIsReceivableModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" variant="primary" size="sm" isLoading={modalLoading}>
                    Salvar Recebível
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Nova Conta a Pagar */}
        {isPayableModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CreditCard className="text-rose-500" /> Nova Conta a Pagar
                </h3>
                <button onClick={() => setIsPayableModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              {modalError && (
                <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle size={16} /> {modalError}
                </div>
              )}

              <form onSubmit={handleCreatePayable} className="space-y-4 text-xs">
                <Input
                  label="Fornecedor / Favorecido *"
                  placeholder="Ex: AWS Cloud Services / Google Workspace"
                  value={newPayable.supplier}
                  onChange={(e) => setNewPayable({ ...newPayable, supplier: e.target.value })}
                  required
                />

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block font-semibold text-slate-700 uppercase tracking-wider">Categoria</label>
                    <select
                      value={newPayable.category}
                      onChange={(e) => setNewPayable({ ...newPayable, category: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs focus:outline-none"
                    >
                      <option value="Infraestrutura">Infraestrutura</option>
                      <option value="Marketing">Marketing / Tráfego</option>
                      <option value="Folha">Folha de Pagamento</option>
                      <option value="Impostos">Impostos / Taxas</option>
                      <option value="Outros">Outros</option>
                    </select>
                  </div>

                  <Input
                    label="Valor (R$) *"
                    type="number"
                    placeholder="0.00"
                    value={newPayable.amount}
                    onChange={(e) => setNewPayable({ ...newPayable, amount: e.target.value })}
                    required
                  />
                </div>

                <Input
                  label="Descrição *"
                  placeholder="Ex: Fatura Servidores Mês 07"
                  value={newPayable.description}
                  onChange={(e) => setNewPayable({ ...newPayable, description: e.target.value })}
                  required
                />

                <Input
                  label="Vencimento *"
                  type="date"
                  value={newPayable.dueDate}
                  onChange={(e) => setNewPayable({ ...newPayable, dueDate: e.target.value })}
                  required
                />

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => setIsPayableModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" variant="primary" size="sm" isLoading={modalLoading}>
                    Salvar Despesa
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
