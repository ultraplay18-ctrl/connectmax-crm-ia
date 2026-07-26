'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Badge } from '../../components/Badge';
import { api } from '../../services/api';
import {
  MessageCircle,
  Sparkles,
  UserCheck,
  Send,
  Plus,
  Phone,
  User,
  Building,
  Target,
  Search,
  Bot,
  CheckCircle2,
  AlertCircle,
  X,
  Smartphone,
  Zap,
} from 'lucide-react';

export default function WhatsappInboxPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  // Resposta manual
  const [inputMessage, setInputMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  // Simulador Modal
  const [isSimulateModalOpen, setIsSimulateModalOpen] = useState(false);
  const [simulateLoading, setSimulateLoading] = useState(false);
  const [simForm, setSimForm] = useState({
    phone: '11999887766',
    clientName: 'Carlos Eduardo',
    content: 'Olá! Gostaria de um orçamento para a contratação do ConnectMax CRM.',
  });

  const fetchConversations = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      const response = await api.get(`/whatsapp/conversations?${params.toString()}`);
      const list = response.data || [];
      setConversations(list);

      // Manter a conversa selecionada atualizada
      if (selectedConversation) {
        const updatedSel = list.find((c: any) => c.id === selectedConversation.id);
        if (updatedSel) setSelectedConversation(updatedSel);
      } else if (list.length > 0) {
        setSelectedConversation(list[0]);
      }
    } catch (err) {
      console.error('Erro ao buscar conversas do WhatsApp:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [statusFilter]);

  const handleSimulateMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSimulateLoading(true);
    try {
      const response = await api.post('/whatsapp/simulate', simForm);
      setIsSimulateModalOpen(false);
      fetchConversations();
      if (response.data) setSelectedConversation(response.data);
    } catch (err) {
      console.error('Erro ao simular WhatsApp:', err);
    } finally {
      setSimulateLoading(false);
    }
  };

  const handleSendManualMessage = async (e?: React.FormEvent, contentText?: string) => {
    if (e) e.preventDefault();
    const text = contentText || inputMessage;
    if (!text.trim() || !selectedConversation) return;

    setSendingMessage(true);
    try {
      await api.post('/whatsapp/send', {
        conversationId: selectedConversation.id,
        content: text,
      });
      setInputMessage('');
      fetchConversations();
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleTransferToHuman = async () => {
    if (!selectedConversation) return;
    try {
      await api.patch('/whatsapp/transfer', {
        conversationId: selectedConversation.id,
        status: 'HUMAN_ATTENDING',
      });
      fetchConversations();
    } catch (err) {
      console.error('Erro ao assumir atendimento:', err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'AI_ATTENDING':
        return <Badge variant="blue">🤖 IA Atendendo</Badge>;
      case 'WAITING_HUMAN':
        return <Badge variant="amber">⏳ Aguardando Humano</Badge>;
      case 'HUMAN_ATTENDING':
        return <Badge variant="green">👤 Atendimento Humano</Badge>;
      default:
        return <Badge variant="slate">Encerrado</Badge>;
    }
  };

  const filteredConversations = conversations.filter((c) => {
    const term = search.toLowerCase();
    const nameMatch = c.contact?.name?.toLowerCase().includes(term);
    const phoneMatch = c.phone?.includes(term);
    return nameMatch || phoneMatch;
  });

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <MessageCircle className="text-emerald-500" /> WhatsApp & Atendimento IA
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Caixa de entrada unificada com atendimento automático por IA, transbordo para humanos e captura de leads.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Smartphone size={16} />}
            onClick={() => setIsSimulateModalOpen(true)}
          >
            Simular Chegada de WhatsApp
          </Button>
        </div>

        {/* Layout da Caixa de Entrada */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 h-[75vh]">
          {/* Coluna Esquerda: Lista de Conversas */}
          <div className="lg:col-span-4 border-r border-slate-200 flex flex-col bg-slate-50/50">
            {/* Filtros da Lista */}
            <div className="p-3 space-y-2 border-b border-slate-200 bg-white">
              <Input
                placeholder="Buscar por nome ou número..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search size={16} />}
              />
              <div className="flex gap-1 overflow-x-auto text-[11px]">
                <button
                  onClick={() => setStatusFilter('')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    statusFilter === '' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Todas
                </button>
                <button
                  onClick={() => setStatusFilter('AI_ATTENDING')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    statusFilter === 'AI_ATTENDING' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  🤖 IA
                </button>
                <button
                  onClick={() => setStatusFilter('HUMAN_ATTENDING')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    statusFilter === 'HUMAN_ATTENDING' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  👤 Humano
                </button>
              </div>
            </div>

            {/* Lista de Chats */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {loading ? (
                <div className="py-12 text-center text-xs text-slate-400">Carregando conversas...</div>
              ) : filteredConversations.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">Nenhuma conversa encontrada.</div>
              ) : (
                filteredConversations.map((conv) => {
                  const isSelected = selectedConversation?.id === conv.id;
                  const lastMsg = conv.messages[conv.messages.length - 1];

                  return (
                    <div
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv)}
                      className={`p-3.5 cursor-pointer transition-all hover:bg-slate-100/80 ${
                        isSelected ? 'bg-white border-l-4 border-brand-500 shadow-sm' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="h-9 w-9 rounded-full bg-emerald-500/10 text-emerald-600 font-bold flex items-center justify-center text-xs shrink-0">
                            {conv.contact?.name?.charAt(0).toUpperCase() || 'W'}
                          </div>
                          <div className="overflow-hidden">
                            <h4 className="text-xs font-bold text-slate-900 truncate">
                              {conv.contact?.name || conv.phone}
                            </h4>
                            <p className="text-[11px] text-slate-500 font-mono">{conv.phone}</p>
                          </div>
                        </div>
                        {getStatusBadge(conv.status)}
                      </div>

                      {lastMsg && (
                        <p className="text-xs text-slate-600 mt-2 truncate font-sans">
                          {lastMsg.senderType === 'CLIENT' ? '👤 ' : lastMsg.senderType === 'AI' ? '🤖 ' : '👨‍💼 '}
                          {lastMsg.content}
                        </p>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Coluna Central: Histórico de Mensagens do Chat */}
          {selectedConversation ? (
            <div className="lg:col-span-5 flex flex-col h-full bg-slate-50">
              {/* Header do Chat Selecionado */}
              <div className="p-3.5 bg-white border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-emerald-500/10 text-emerald-600 font-bold flex items-center justify-center text-xs">
                    {selectedConversation.contact?.name?.charAt(0).toUpperCase() || 'W'}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">
                      {selectedConversation.contact?.name || selectedConversation.phone}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-mono">WhatsApp: {selectedConversation.phone}</span>
                  </div>
                </div>

                {selectedConversation.status !== 'HUMAN_ATTENDING' && (
                  <Button variant="primary" size="sm" onClick={handleTransferToHuman} leftIcon={<UserCheck size={14} />}>
                    Assumir Atendimento
                  </Button>
                )}
              </div>

              {/* Mensagens do Chat */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {selectedConversation.messages?.map((msg: any) => {
                  const isClient = msg.senderType === 'CLIENT';
                  const isAi = msg.senderType === 'AI';

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isClient ? 'items-start' : 'items-end'}`}
                    >
                      <div
                        className={`max-w-md rounded-2xl p-3.5 text-xs shadow-sm leading-relaxed ${
                          isClient
                            ? 'bg-white border border-slate-200 text-slate-900 rounded-tl-none'
                            : isAi
                            ? 'bg-gradient-to-r from-brand-900 to-indigo-950 text-white rounded-tr-none border border-brand-500/30'
                            : 'bg-emerald-600 text-white rounded-tr-none'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4 font-semibold text-[10px] mb-1 opacity-80">
                          <span>{msg.senderName || (isClient ? 'Cliente' : isAi ? 'IA Bot' : 'Atendente')}</span>
                          <span>{new Date(msg.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        {msg.content}
                      </div>

                      {/* Sugestão de Resposta da IA para o Atendente */}
                      {msg.suggestedReply && (
                        <div className="mt-1.5 max-w-md p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 text-[11px]">
                          <div className="flex items-center justify-between font-bold mb-1">
                            <span className="flex items-center gap-1">
                              <Sparkles size={13} className="text-amber-600" /> Sugestão da IA para o Atendente:
                            </span>
                            <button
                              onClick={() => handleSendManualMessage(undefined, msg.suggestedReply)}
                              className="text-[10px] bg-amber-600 text-white px-2 py-0.5 rounded font-semibold hover:bg-amber-700 transition-colors"
                            >
                              Usar Sugestão
                            </button>
                          </div>
                          {msg.suggestedReply}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Form de Envio Manual */}
              <form onSubmit={handleSendManualMessage} className="p-3 bg-white border-t border-slate-200 flex gap-2">
                <input
                  type="text"
                  placeholder="Responder como Atendente Humano..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  disabled={sendingMessage}
                  className="flex-1 text-xs border border-slate-300 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-slate-900"
                />
                <Button type="submit" variant="primary" size="sm" isLoading={sendingMessage} rightIcon={<Send size={14} />}>
                  Enviar
                </Button>
              </form>
            </div>
          ) : (
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <MessageCircle size={48} className="mb-2 text-slate-300" />
              <p className="text-sm font-semibold">Selecione uma conversa para visualizar</p>
            </div>
          )}

          {/* Coluna Direita: Contexto CRM do Cliente e Oportunidades */}
          {selectedConversation && (
            <div className="lg:col-span-3 border-l border-slate-200 bg-white p-4 space-y-4 overflow-y-auto">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
                Contexto CRM do Cliente
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Nome</span>
                  <span className="font-bold text-slate-900">{selectedConversation.contact?.name || 'Cliente WhatsApp'}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Telefone</span>
                  <span className="font-mono text-slate-800">{selectedConversation.phone}</span>
                </div>

                {selectedConversation.intent && (
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Intenção Identificada</span>
                    <Badge variant="blue">{selectedConversation.intent}</Badge>
                  </div>
                )}
              </div>

              {/* Oportunidade (Lead) Capturada */}
              <div className="pt-3 border-t border-slate-100">
                <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Target size={14} className="text-brand-500" /> Oportunidade Capturada
                </h4>

                {selectedConversation.contact?.leads?.length > 0 ? (
                  selectedConversation.contact.leads.map((l: any) => (
                    <div key={l.id} className="p-3 rounded-xl bg-brand-50/60 border border-brand-100 space-y-1">
                      <span className="text-xs font-bold text-brand-900 block">{l.title}</span>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Origem: <strong>{l.source}</strong></span>
                        <Badge variant="amber">{l.status}</Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[11px] text-slate-400 italic">Nenhum lead vinculado ainda.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Simulador de Mensagem WhatsApp */}
        {isSimulateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Smartphone className="text-emerald-500" /> Simulador de Entrada do WhatsApp
                </h3>
                <button onClick={() => setIsSimulateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSimulateMessage} className="space-y-4 text-xs">
                <Input
                  label="Número do WhatsApp *"
                  placeholder="11999887766"
                  value={simForm.phone}
                  onChange={(e) => setSimForm({ ...simForm, phone: e.target.value })}
                  required
                />

                <Input
                  label="Nome do Cliente *"
                  placeholder="Carlos Eduardo"
                  value={simForm.clientName}
                  onChange={(e) => setSimForm({ ...simForm, clientName: e.target.value })}
                />

                <div className="space-y-1.5">
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider">
                    Mensagem Recebida do WhatsApp *
                  </label>
                  <textarea
                    rows={4}
                    value={simForm.content}
                    onChange={(e) => setSimForm({ ...simForm, content: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    required
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => setIsSimulateModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" variant="primary" size="sm" isLoading={simulateLoading} rightIcon={<Zap size={14} />}>
                    Disparar Mensagem
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
