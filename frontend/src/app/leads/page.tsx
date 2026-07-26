'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Badge } from '../../components/Badge';
import { api } from '../../services/api';
import {
  Target,
  Plus,
  Search,
  Filter,
  DollarSign,
  User,
  Building,
  ArrowRight,
  MoreVertical,
  X,
  CheckCircle2,
  AlertCircle,
  FileText,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Flame,
} from 'lucide-react';

const KANBAN_STAGES = [
  { id: 'NEW_LEAD', title: 'Novo Lead', color: 'border-blue-400 bg-blue-500/5', badge: 'blue' },
  { id: 'FIRST_CONTACT', title: 'Primeiro Contato', color: 'border-indigo-400 bg-indigo-500/5', badge: 'blue' },
  { id: 'QUALIFICATION', title: 'Qualificação', color: 'border-purple-400 bg-purple-500/5', badge: 'blue' },
  { id: 'PROPOSAL_SENT', title: 'Proposta Enviada', color: 'border-amber-400 bg-amber-500/5', badge: 'amber' },
  { id: 'NEGOTIATION', title: 'Negociação', color: 'border-orange-400 bg-orange-500/5', badge: 'amber' },
  { id: 'WON', title: 'Ganho', color: 'border-emerald-400 bg-emerald-500/5', badge: 'green' },
  { id: 'LOST', title: 'Perdido', color: 'border-rose-400 bg-rose-500/5', badge: 'red' },
];

export default function LeadsKanbanPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [search, setSearch] = useState('');
  const [sellerFilter, setSellerFilter] = useState('');

  // Modal Novo Lead
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');
  const [newLead, setNewLead] = useState({
    title: '',
    contactId: '',
    assignedUserId: '',
    source: 'Website',
    status: 'NEW_LEAD',
    value: '',
    notes: '',
  });

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (sellerFilter) params.append('assignedUserId', sellerFilter);

      const response = await api.get(`/leads?${params.toString()}`);
      setLeads(response.data || []);
    } catch (err) {
      console.error('Erro ao buscar leads:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuxiliaryData = async () => {
    try {
      const [contactsRes, usersRes] = await Promise.all([
        api.get('/contacts'),
        api.get('/users'),
      ]);
      setContacts(contactsRes.data || []);
      setUsers(usersRes.data || []);
    } catch (err) {
      console.error('Erro ao buscar contatos ou vendedores:', err);
    }
  };

  useEffect(() => {
    fetchAuxiliaryData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLeads();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, sellerFilter]);

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');

    if (!newLead.title) {
      setModalError('O título da oportunidade é obrigatório.');
      return;
    }

    setModalLoading(true);
    try {
      await api.post('/leads', {
        ...newLead,
        value: newLead.value ? parseFloat(newLead.value) : 0,
      });

      setIsModalOpen(false);
      setNewLead({
        title: '',
        contactId: '',
        assignedUserId: '',
        source: 'Website',
        status: 'NEW_LEAD',
        value: '',
        notes: '',
      });
      fetchLeads();
    } catch (err: any) {
      setModalError(err.response?.data?.message || 'Erro ao cadastrar oportunidade.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleMoveStage = async (leadId: string, nextStatus: string) => {
    try {
      // Atualização otimista na UI
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: nextStatus } : l)),
      );

      await api.patch(`/leads/${leadId}/status`, { status: nextStatus });
    } catch (err) {
      console.error('Erro ao mover lead:', err);
      fetchLeads();
    }
  };

  const handleQualifyLead = async (leadId: string) => {
    try {
      await api.post(`/leads/${leadId}/qualify`);
      fetchLeads();
    } catch (err) {
      console.error('Erro ao qualificar lead com IA:', err);
    }
  };

  const getAiScoreBadge = (score: string) => {
    switch (score) {
      case 'HOT':
        return <Badge variant="red">🔥 Quente</Badge>;
      case 'WARM':
        return <Badge variant="amber">⚠️ Morno</Badge>;
      case 'COLD':
        return <Badge variant="blue">❄️ Frio</Badge>;
      default:
        return null;
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta oportunidade?')) return;
    try {
      await api.delete(`/leads/${leadId}`);
      fetchLeads();
    } catch (err) {
      console.error('Erro ao excluir oportunidade:', err);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header do Funil */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Target className="text-brand-500" /> Pipeline de Vendas (Kanban)
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Acompanhe as oportunidades comerciais da sua empresa por etapa de negociação.
            </p>
          </div>
          <Button variant="primary" leftIcon={<Plus size={18} />} onClick={() => setIsModalOpen(true)}>
            Nova Oportunidade
          </Button>
        </div>

        {/* Filtros e Busca */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-80">
            <Input
              placeholder="Buscar por título, origem ou cliente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search size={18} />}
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <User size={16} className="text-slate-400 shrink-0" />
            <span className="text-xs text-slate-500 font-medium">Vendedor:</span>
            <select
              value={sellerFilter}
              onChange={(e) => setSellerFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="">Todos os Vendedores</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quadro Kanban de Colunas */}
        <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-thin">
          {KANBAN_STAGES.map((stage) => {
            const stageLeads = leads.filter((l) => l.status === stage.id);
            const totalStageValue = stageLeads.reduce((acc, curr) => acc + (curr.value || 0), 0);

            return (
              <div
                key={stage.id}
                className={`w-72 shrink-0 rounded-2xl border ${stage.color} bg-slate-100/70 p-3 flex flex-col max-h-[78vh]`}
              >
                {/* Header da Coluna */}
                <div className="pb-3 border-b border-slate-200/80 mb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      {stage.title}
                    </span>
                    <Badge variant={stage.badge as any}>{stageLeads.length}</Badge>
                  </div>
                  <p className="text-xs font-semibold text-brand-600 mt-1 font-mono">
                    {formatCurrency(totalStageValue)}
                  </p>
                </div>

                {/* Lista de Cards de Oportunidades */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {stageLeads.length === 0 ? (
                    <div className="py-8 text-center border border-dashed border-slate-300 rounded-xl bg-white/50 text-slate-400 text-xs">
                      Nenhuma oportunidade
                    </div>
                  ) : (
                    stageLeads.map((lead) => (
                      <div
                        key={lead.id}
                        className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3 group"
                      >
                        {/* Título & Valor */}
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-semibold text-slate-900 group-hover:text-brand-600 transition-colors leading-tight">
                            {lead.title}
                          </h4>
                          <div className="flex items-center gap-1">
                            {lead.aiScore && getAiScoreBadge(lead.aiScore)}
                            <button
                              onClick={() => handleDeleteLead(lead.id)}
                              title="Excluir Oportunidade"
                              className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Justificativa da IA (se houver) */}
                        {lead.aiReasoning && (
                          <div className="p-2 rounded-lg bg-brand-50/60 border border-brand-100 text-[10px] text-slate-700 font-sans leading-tight">
                            {lead.aiReasoning}
                          </div>
                        )}

                        {/* Cliente associado */}
                        {lead.contact && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-600">
                            <Building size={13} className="text-slate-400 shrink-0" />
                            <span className="truncate">{lead.contact.name}</span>
                          </div>
                        )}

                        {/* Valor da Oportunidade */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                          <span className="font-bold text-slate-900 font-mono">
                            {formatCurrency(lead.value)}
                          </span>
                          {lead.source && (
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px] font-medium">
                              {lead.source}
                            </span>
                          )}
                        </div>

                        {/* Responsável e Movimentação Rápida */}
                        <div className="flex items-center justify-between pt-1">
                          <button
                            onClick={() => handleQualifyLead(lead.id)}
                            title="Analisar temperatura do lead com IA"
                            className="text-[10px] font-semibold flex items-center gap-1 text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 rounded px-1.5 py-1 transition-colors"
                          >
                            <Sparkles size={11} /> Qualificar IA
                          </button>

                          {/* Seletor Rápido de Etapa */}
                          <select
                            value={lead.status}
                            onChange={(e) => handleMoveStage(lead.id, e.target.value)}
                            className="text-[10px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded px-1.5 py-1 focus:outline-none cursor-pointer"
                          >
                            {KANBAN_STAGES.map((s) => (
                              <option key={s.id} value={s.id}>
                                Move: {s.title}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal para Cadastro Rápido de Oportunidade */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Target className="text-brand-500" /> Nova Oportunidade de Venda
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>

              {modalError && (
                <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle size={16} /> {modalError}
                </div>
              )}

              <form onSubmit={handleCreateLead} className="space-y-4 text-xs">
                <Input
                  label="Título da Oportunidade *"
                  placeholder="Ex: Licenciamento de Software 100 Usuários"
                  value={newLead.title}
                  onChange={(e) => setNewLead({ ...newLead, title: e.target.value })}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block font-semibold text-slate-700 uppercase tracking-wider">
                      Cliente / Contato
                    </label>
                    <select
                      value={newLead.contactId}
                      onChange={(e) => setNewLead({ ...newLead, contactId: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    >
                      <option value="">Selecione o Cliente</option>
                      {contacts.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} {c.companyName ? `(${c.companyName})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-semibold text-slate-700 uppercase tracking-wider">
                      Vendedor Responsável
                    </label>
                    <select
                      value={newLead.assignedUserId}
                      onChange={(e) => setNewLead({ ...newLead, assignedUserId: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    >
                      <option value="">Selecione o Responsável</option>
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Valor Estimado (R$)"
                    type="number"
                    placeholder="0.00"
                    value={newLead.value}
                    onChange={(e) => setNewLead({ ...newLead, value: e.target.value })}
                  />

                  <div className="space-y-1.5">
                    <label className="block font-semibold text-slate-700 uppercase tracking-wider">
                      Origem do Lead
                    </label>
                    <select
                      value={newLead.source}
                      onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    >
                      <option value="Website">Website / Landing Page</option>
                      <option value="Indicação">Indicação de Cliente</option>
                      <option value="WhatsApp">WhatsApp / Chat</option>
                      <option value="Outbound">Outbound / Prospecção</option>
                      <option value="Evento">Evento / Feira</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider">
                    Etapa Inicial no Kanban
                  </label>
                  <select
                    value={newLead.status}
                    onChange={(e) => setNewLead({ ...newLead, status: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  >
                    {KANBAN_STAGES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider">
                    Observações
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Detalhes adicionais sobre o negócio..."
                    value={newLead.notes}
                    onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                  <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" variant="primary" size="sm" isLoading={modalLoading} rightIcon={<CheckCircle2 size={16} />}>
                    Criar Oportunidade
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
