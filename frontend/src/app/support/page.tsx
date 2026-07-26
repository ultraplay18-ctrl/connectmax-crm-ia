'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { api } from '../../services/api';
import { useAuth } from '../../auth/AuthContext';
import {
  HelpCircle,
  PlusCircle,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertTriangle,
  Send,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  FileUp,
} from 'lucide-react';
import Link from 'next/link';

export default function ClientSupportPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Create ticket form
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIA');
  const [category, setCategory] = useState('SUPORTE');
  const [submitting, setSubmitting] = useState(false);
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);

  // Selected Ticket details chat
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await api.get('/support/tickets');
      setTickets(res.data || []);
    } catch (err) {
      console.error('Erro ao buscar chamados de suporte:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/support/tickets', { subject, description, priority, category });
      setSubject('');
      setDescription('');
      setShowNewTicketForm(false);
      fetchTickets();
      alert('Chamado aberto com sucesso!');
    } catch (err) {
      console.error('Erro ao abrir ticket de suporte:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewTicketDetails = async (id: string) => {
    try {
      const res = await api.get(`/support/tickets/${id}`);
      setSelectedTicket(res.data);
    } catch (err) {
      console.error('Erro ao buscar detalhes do ticket:', err);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTicket) return;
    setSendingReply(true);
    try {
      await api.post(`/support/tickets/${selectedTicket.id}/messages`, { message: replyMessage });
      setReplyMessage('');
      handleViewTicketDetails(selectedTicket.id);
    } catch (err) {
      console.error('Erro ao responder ticket:', err);
    } finally {
      setSendingReply(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="text-brand-500" /> Central de Suporte & Chamados
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Abra chamados para dúvidas, financeiro, erros ou integrações e converse em tempo real com nossos especialistas.
            </p>
          </div>

          <div className="flex gap-2">
            <Link href="/help">
              <span>
                <Button variant="outline" className="border-slate-300 text-slate-700">
                  Base de Conhecimento
                </Button>
              </span>
            </Link>
            <Button variant="primary" leftIcon={<PlusCircle size={16} />} onClick={() => setShowNewTicketForm(!showNewTicketForm)}>
              {showNewTicketForm ? 'Ver Meus Chamados' : 'Abrir Novo Chamado'}
            </Button>
          </div>
        </div>

        {showNewTicketForm ? (
          /* FORMULARIO DE ABERTURA DE TICKET */
          <div className="max-w-xl mx-auto">
            <Card title="Abertura de Chamado Técnico">
              <form onSubmit={handleCreateTicket} className="space-y-4 py-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">Assunto / Título *</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Ex: Erro ao gerar token do WhatsApp"
                    className="w-full h-10 bg-slate-50 border border-slate-250 rounded-lg px-3 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 block">Categoria *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full h-10 rounded-lg bg-slate-50 border border-slate-250 px-3 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    >
                      <option value="SUPORTE">Suporte Técnico</option>
                      <option value="FINANCEIRO">Faturamento & Cobrança</option>
                      <option value="INTEGRACAO">WhatsApp & Integrações</option>
                      <option value="GERAL">Outras Dúvidas</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 block">Prioridade *</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full h-10 rounded-lg bg-slate-50 border border-slate-250 px-3 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    >
                      <option value="BAIXA">Baixa</option>
                      <option value="MEDIA">Média</option>
                      <option value="ALTA">Alta</option>
                      <option value="URGENTE">Urgente</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">Descrição do Problema *</label>
                  <textarea
                    rows={5}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descreva em detalhes o erro ou dúvida para agilizar o suporte..."
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>

                {/* Simulated File upload input */}
                <div className="p-3.5 border border-dashed border-slate-250 rounded-xl bg-slate-50/50 flex flex-col items-center justify-center gap-1.5 text-center cursor-pointer">
                  <FileUp size={20} className="text-slate-400" />
                  <span className="text-[10px] text-slate-500 font-semibold">Simular anexo de imagens/arquivos</span>
                  <span className="text-[9px] text-slate-400">PDF, PNG, JPG até 5MB</span>
                </div>

                <Button variant="primary" type="submit" className="w-full py-3" isLoading={submitting}>
                  Enviar Chamado Técnico
                </Button>
              </form>
            </Card>
          </div>
        ) : selectedTicket ? (
          /* TICKET DETAILS AND CHAT WINDOW */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Coluna Dados do Chamado */}
            <div className="space-y-6 lg:col-span-1">
              <Card title="Detalhes do Chamado">
                <div className="space-y-4 py-2 text-xs">
                  <div className="space-y-1">
                    <span className="text-slate-400 block">Assunto:</span>
                    <strong className="text-slate-800 block text-xs">{selectedTicket.subject}</strong>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 block">Descrição Inicial:</span>
                    <p className="text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">{selectedTicket.description}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 block">Status:</span>
                    <Badge variant={selectedTicket.status === 'RESOLVIDO' ? 'green' : 'blue'}>
                      {selectedTicket.status}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 block">Prioridade:</span>
                    <Badge variant={selectedTicket.priority === 'URGENTE' || selectedTicket.priority === 'ALTA' ? 'red' : 'slate'}>
                      {selectedTicket.priority}
                    </Badge>
                  </div>
                </div>
              </Card>

              <Button variant="outline" className="w-full border-slate-300 text-slate-700" onClick={() => setSelectedTicket(null)}>
                Voltar à Lista
              </Button>
            </div>

            {/* Coluna Chat de Mensagens */}
            <div className="lg:col-span-2">
              <Card title="Conversa com Suporte">
                <div className="flex flex-col h-96 justify-between">
                  {/* Messages listing */}
                  <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50 rounded-xl border border-slate-100 mb-4 max-h-[300px]">
                    <div className="text-[10px] text-slate-400 text-center py-2">
                      Chamado iniciado em {new Date(selectedTicket.createdAt).toLocaleDateString('pt-BR')}
                    </div>

                    {selectedTicket.messages?.length === 0 ? (
                      <div className="text-center text-[10px] text-slate-450 py-8">
                        Nenhuma mensagem trocada ainda. Nossa equipe analisará seu chamado em breve.
                      </div>
                    ) : (
                      selectedTicket.messages.map((msg: any) => {
                        const isSystemOrAdmin = msg.sender?.role?.name === 'SUPER_ADMIN';

                        return (
                          <div key={msg.id} className={`flex ${isSystemOrAdmin ? 'justify-start' : 'justify-end'}`}>
                            <div
                              className={`max-w-[80%] rounded-2xl p-3 text-xs ${
                                isSystemOrAdmin
                                  ? 'bg-slate-200 text-slate-800 rounded-tl-none'
                                  : 'bg-brand-500 text-white rounded-tr-none'
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
                      })
                    )}
                  </div>

                  {/* Send replies form */}
                  <form onSubmit={handleSendReply} className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Digite sua resposta técnica..."
                      className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-850 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                    <Button variant="primary" type="submit" isLoading={sendingReply} rightIcon={<Send size={14} />}>
                      Enviar
                    </Button>
                  </form>
                </div>
              </Card>
            </div>
          </div>
        ) : (
          /* LISTAGEM DE CHAMADOS */
          <Card title="Meus Chamados de Suporte">
            {loading ? (
              <div className="py-12 text-center text-xs text-slate-500">Carregando seus tickets...</div>
            ) : tickets.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500 border border-dashed border-slate-250 rounded-xl">
                Você não possui nenhum chamado de suporte em andamento.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider">
                      <th className="p-3">Assunto</th>
                      <th className="p-3">Categoria</th>
                      <th className="p-3">Prioridade</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Criado em</th>
                      <th className="p-3 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tickets.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-bold text-slate-800">{t.subject}</td>
                        <td className="p-3 text-slate-600">{t.category}</td>
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
                          <Button variant="outline" size="sm" onClick={() => handleViewTicketDetails(t.id)}>
                            Acessar Chamado
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
