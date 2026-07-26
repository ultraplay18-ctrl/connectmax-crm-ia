'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
import { api } from '../../../services/api';
import {
  HelpCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  Send,
  Building,
  User,
} from 'lucide-react';

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>({
    openTickets: 0,
    resolvedTickets: 0,
    totalTickets: 0,
    averageReplyTime: '0m',
    satisfactionRate: 100,
  });

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');

  // Selected Chat state
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState('');

  const fetchAdminSupportData = async () => {
    setLoading(true);
    try {
      const [ticketsRes, metricsRes] = await Promise.all([
        api.get('/support/admin/tickets'),
        api.get('/support/admin/metrics'),
      ]);

      setTickets(ticketsRes.data || []);
      setMetrics(metricsRes.data || {});
    } catch (err) {
      console.error('Erro ao buscar dados do suporte administrativo:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminSupportData();
  }, []);

  const handleSelectTicket = async (id: string) => {
    try {
      const res = await api.get(`/support/tickets/${id}`);
      setSelectedTicket(res.data);
      setStatusUpdate(res.data.status);
    } catch (err) {
      console.error('Erro ao buscar ticket:', err);
    }
  };

  const handleSendAdminReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;
    setSending(true);
    try {
      // Envia resposta técnica do admin
      await api.post(`/support/tickets/${selectedTicket.id}/messages`, { message: replyText });
      
      // Mudar status caso tenha selecionado um status diferente
      if (statusUpdate !== selectedTicket.status) {
        await api.patch(`/support/admin/tickets/${selectedTicket.id}`, { status: statusUpdate });
      }

      setReplyText('');
      handleSelectTicket(selectedTicket.id);
      fetchAdminSupportData();
    } catch (err) {
      console.error('Erro ao responder ticket:', err);
    } finally {
      setSending(false);
    }
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.company?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.user?.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus ? t.status === filterStatus : true;
    const matchesPriority = filterPriority ? t.priority === filterPriority : true;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="text-brand-500" /> Central de Atendimento Técnico (Global)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Painel de administração e respostas a chamados abertos por empresas do ConnectMax CRM IA.
          </p>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Tickets Abertos</span>
            <div className="text-2xl font-bold text-slate-900 font-mono">{metrics.openTickets}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Tickets Resolvidos</span>
            <div className="text-2xl font-bold text-slate-900 font-mono text-emerald-600">{metrics.resolvedTickets}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Total Recebidos</span>
            <div className="text-2xl font-bold text-slate-900 font-mono">{metrics.totalTickets}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Tempo Resposta</span>
            <div className="text-2xl font-bold text-slate-900 font-mono">{metrics.averageReplyTime}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Satisfação Geral</span>
            <div className="text-2xl font-bold text-brand-650 font-mono">{metrics.satisfactionRate}%</div>
          </div>
        </div>

        {selectedTicket ? (
          /* CHAT DETALHADO DO TICKET PELO ADMIN */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Coluna Detalhes */}
            <div className="space-y-6 lg:col-span-1">
              <Card title="Dados do Ticket">
                <div className="space-y-4 py-2 text-xs">
                  <div className="space-y-1">
                    <span className="text-slate-400 block">Empresa Cliente:</span>
                    <strong className="text-slate-800 flex items-center gap-1.5">
                      <Building size={14} className="text-slate-400" /> {selectedTicket.company?.name}
                    </strong>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 block">Usuário Solicitante:</span>
                    <strong className="text-slate-800 flex items-center gap-1.5">
                      <User size={14} className="text-slate-400" /> {selectedTicket.user?.name} ({selectedTicket.user?.email})
                    </strong>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 block">Assunto:</span>
                    <strong className="text-slate-800 block">{selectedTicket.subject}</strong>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 block">Descrição Inicial:</span>
                    <p className="text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed">
                      {selectedTicket.description}
                    </p>
                  </div>
                </div>
              </Card>

              <Button variant="outline" className="w-full border-slate-300 text-slate-700" onClick={() => setSelectedTicket(null)}>
                Voltar aos Tickets
              </Button>
            </div>

            {/* Coluna Chat & Resposta */}
            <div className="lg:col-span-2 space-y-6">
              <Card title="Histórico da Conversa com Cliente">
                <div className="flex flex-col h-[400px] justify-between">
                  {/* Messages */}
                  <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50 rounded-xl border border-slate-100 mb-4 max-h-[220px]">
                    {selectedTicket.messages?.map((msg: any) => {
                      const isSuperAdmin = msg.sender?.role?.name === 'SUPER_ADMIN';

                      return (
                        <div key={msg.id} className={`flex ${isSuperAdmin ? 'justify-end' : 'justify-start'}`}>
                          <div
                            className={`max-w-[80%] rounded-2xl p-3 text-xs ${
                              isSuperAdmin
                                ? 'bg-brand-500 text-white rounded-tr-none'
                                : 'bg-slate-200 text-slate-800 rounded-tl-none'
                            }`}
                          >
                            <div className="flex justify-between items-center gap-2 mb-1.5 text-[9px] opacity-75">
                              <strong>{msg.sender?.name}</strong>
                              <span className="font-mono">
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="leading-relaxed whitespace-pre-line">{msg.message}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Resposta do Admin */}
                  <form onSubmit={handleSendAdminReply} className="space-y-3 border-t border-slate-100 pt-3">
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="font-semibold text-slate-700">Atualizar Status do Ticket:</span>
                      <select
                        value={statusUpdate}
                        onChange={(e) => setStatusUpdate(e.target.value)}
                        className="bg-slate-50 border border-slate-250 rounded-lg p-2 text-xs text-slate-700"
                      >
                        <option value="ABERTO">ABERTO</option>
                        <option value="EM_ANALISE">EM ANALISE</option>
                        <option value="AGUARDANDO_CLIENTE">AGUARDANDO CLIENTE</option>
                        <option value="RESOLVIDO">RESOLVIDO</option>
                        <option value="FECHADO">FECHADO</option>
                      </select>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Digite a resposta com suporte técnico de engenharia..."
                        className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                      <Button variant="primary" type="submit" isLoading={sending} rightIcon={<Send size={14} />}>
                        Responder
                      </Button>
                    </div>
                  </form>
                </div>
              </Card>
            </div>
          </div>
        ) : (
          /* LISTAGEM PRINCIPAL COM BUSCA E FILTROS */
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-grow max-w-md relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Buscar por assunto, empresa ou solicitante..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1 text-xs">
                  <Filter size={14} className="text-slate-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-700"
                  >
                    <option value="">Todos os Status</option>
                    <option value="ABERTO">ABERTO</option>
                    <option value="EM_ANALISE">EM ANALISE</option>
                    <option value="AGUARDANDO_CLIENTE">AGUARDANDO CLIENTE</option>
                    <option value="RESOLVIDO">RESOLVIDO</option>
                    <option value="FECHADO">FECHADO</option>
                  </select>
                </div>

                <div className="flex items-center gap-1 text-xs">
                  <Filter size={14} className="text-slate-400" />
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-700"
                  >
                    <option value="">Todas as Prioridades</option>
                    <option value="BAIXA">BAIXA</option>
                    <option value="MEDIA">MEDIA</option>
                    <option value="ALTA">ALTA</option>
                    <option value="URGENTE">URGENTE</option>
                  </select>
                </div>
              </div>
            </div>

            <Card title="Lista Global de Tickets de Suporte">
              {loading ? (
                <div className="py-12 text-center text-xs text-slate-500">Buscando chamados globais...</div>
              ) : filteredTickets.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                  Nenhum ticket pendente ou encontrado com estes filtros.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider">
                        <th className="p-3">Assunto</th>
                        <th className="p-3">Empresa</th>
                        <th className="p-3">Prioridade</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Criado em</th>
                        <th className="p-3 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredTickets.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50/50">
                          <td className="p-3 font-bold text-slate-800">{t.subject}</td>
                          <td className="p-3 text-slate-600">{t.company?.name}</td>
                          <td className="p-3">
                            <Badge variant={t.priority === 'URGENTE' || t.priority === 'ALTA' ? 'red' : 'slate'}>
                              {t.priority}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <Badge variant={t.status === 'RESOLVIDO' ? 'green' : 'blue'}>
                              {t.status}
                            </Badge>
                          </td>
                          <td className="p-3 text-slate-500 font-mono">
                            {new Date(t.createdAt).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="p-3 text-right">
                            <Button variant="outline" size="sm" onClick={() => handleSelectTicket(t.id)}>
                              Responder
                            </Button>
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
      </div>
    </DashboardLayout>
  );
}
