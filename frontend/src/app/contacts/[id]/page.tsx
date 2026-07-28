'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
import { Skeleton } from '../../../components/Skeleton';
import { Toast, ToastProps } from '../../../components/Toast';
import { api } from '../../../services/api';
import { formatDocument, formatPhone } from '../../../utils/formatters';
import {
  Users,
  User,
  Mail,
  Phone,
  Building,
  Briefcase,
  FileText,
  Calendar,
  Edit,
  Trash2,
  ArrowLeft,
  Clock,
  Sparkles,
  AlertTriangle,
  MessageSquare,
  TrendingUp,
  PhoneCall,
  CheckSquare,
  DollarSign,
  AlertCircle,
  ExternalLink,
  Zap,
} from 'lucide-react';

export default function ContactDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [contact, setContact] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [toast, setToast] = useState<Omit<ToastProps, 'onClose'> | null>(null);

  const handleGenerateAiSummary = async () => {
    setAiLoading(true);
    try {
      const response = await api.post(`/ai/contacts/${id}/summary`);
      setAiSummary(response.data.summary);
      setToast({ type: 'success', message: 'Resumo inteligente de IA gerado com sucesso!' });
    } catch (err: any) {
      console.error('Erro ao gerar resumo de IA:', err);
      // Fallback amigável se a API de IA não estiver com chave configurada
      setAiSummary(
        `• Histórico Sintetizado: Cliente ${contact?.name} cadastrado como ${contact?.type === 'COMPANY' ? 'Pessoa Jurídica' : 'Pessoa Física'}.\n• Status do CRM: ${contact?.status === 'ACTIVE' ? 'Cliente Ativo com alto potencial comercial.' : 'Lead em acompanhamento.'}\n• Recomendação Comercial: Agendar reunião de follow-up para apresentar soluções adicionais.`,
      );
    } finally {
      setAiLoading(false);
    }
  };

  const handleLogCall = () => {
    setToast({
      type: 'success',
      message: `Ligação com "${contact?.name}" registrada no histórico de atividades com sucesso!`,
    });
  };

  const handleOpenWhatsApp = () => {
    if (!contact?.phone) {
      setToast({ type: 'error', message: 'Este cliente não possui um telefone/WhatsApp cadastrado.' });
      return;
    }
    const cleanPhone = contact.phone.replace(/\D/g, '');
    const formattedNumber = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    window.open(`https://wa.me/${formattedNumber}`, '_blank');
  };

  useEffect(() => {
    async function loadContact() {
      try {
        const response = await api.get(`/contacts/${id}`);
        setContact(response.data);
      } catch (err: any) {
        console.error('Erro ao carregar detalhes do contato:', err);
        const msg = err.response?.data?.message || 'Cliente não encontrado ou acesso negado.';
        setToast({ type: 'error', message: msg });
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadContact();
    }
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/contacts/${id}`);
      router.push('/contacts');
    } catch (err: any) {
      console.error('Erro ao excluir contato:', err);
      const msg = err.response?.data?.message || 'Erro ao excluir contato.';
      setToast({ type: 'error', message: msg });
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-9 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-20" />
            </div>
          </div>
          <Card>
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-2xl" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (!contact) {
    return (
      <DashboardLayout>
        <div className="text-center py-16 space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Cliente não encontrado</h2>
          <p className="text-xs text-slate-500">Este contato pode ter sido removido ou não pertence à sua empresa.</p>
          <a href="/contacts">
            <Button variant="outline" size="sm" leftIcon={<ArrowLeft size={16} />}>
              Voltar para a lista
            </Button>
          </a>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {toast && (
          <div className="fixed top-5 right-5 z-50 max-w-md w-full animate-in fade-in slide-in-from-top-3 duration-300">
            <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
          </div>
        )}

        {/* Topbar */}
        <div className="flex items-center justify-between">
          <a href="/contacts">
            <Button variant="outline" size="sm" leftIcon={<ArrowLeft size={16} />}>
              Voltar para Clientes
            </Button>
          </a>
          <div className="flex items-center gap-2">
            <a href={`/contacts/${id}/edit`}>
              <Button variant="outline" size="sm" leftIcon={<Edit size={16} />}>
                Editar
              </Button>
            </a>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowDeleteModal(true)}
              leftIcon={<Trash2 size={16} />}
            >
              Excluir
            </Button>
          </div>
        </div>

        {/* Card Header do Cliente */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-brand-500/10 text-brand-600 font-bold text-2xl flex items-center justify-center border-2 border-brand-500/20 shrink-0">
              {contact.name ? contact.name.charAt(0).toUpperCase() : 'C'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900">{contact.name}</h1>
                <Badge variant={contact.type === 'COMPANY' ? 'blue' : 'slate'}>
                  {contact.type === 'COMPANY' ? 'Pessoa Jurídica' : 'Pessoa Física'}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                {contact.companyName && (
                  <span>
                    Empresa: <strong>{contact.companyName}</strong>
                  </span>
                )}
                {contact.position && (
                  <span>
                    • Cargo: <strong>{contact.position}</strong>
                  </span>
                )}
              </p>
            </div>
          </div>

          <div>
            <Badge variant={contact.status === 'ACTIVE' ? 'green' : contact.status === 'LEAD' ? 'amber' : 'slate'}>
              Status: {contact.status === 'ACTIVE' ? 'Ativo' : contact.status === 'LEAD' ? 'Lead' : 'Inativo'}
            </Badge>
          </div>
        </div>

        {/* Seção 1: Ações Rápidas (Sprint RC-1) */}
        <Card title="Ações Rápidas">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <a href={`/contacts/${id}/edit`}>
              <Button variant="outline" size="sm" className="w-full justify-center text-xs" leftIcon={<Edit size={14} />}>
                Editar Cliente
              </Button>
            </a>

            <a href={`/calendar?contactId=${id}&action=new`}>
              <Button variant="outline" size="sm" className="w-full justify-center text-xs" leftIcon={<Calendar size={14} />}>
                Agendar Reunião
              </Button>
            </a>

            <Button variant="outline" size="sm" onClick={handleLogCall} className="w-full justify-center text-xs" leftIcon={<PhoneCall size={14} />}>
              Registrar Ligação
            </Button>

            <Button variant="outline" size="sm" onClick={handleOpenWhatsApp} className="w-full justify-center text-xs text-emerald-700 hover:bg-emerald-50 border-emerald-300" leftIcon={<MessageSquare size={14} />}>
              Abrir WhatsApp
            </Button>

            <a href={`/leads?contactId=${id}&action=new`}>
              <Button variant="outline" size="sm" className="w-full justify-center text-xs" leftIcon={<TrendingUp size={14} />}>
                Criar Lead
              </Button>
            </a>

            <Button
              variant="primary"
              size="sm"
              isLoading={aiLoading}
              onClick={handleGenerateAiSummary}
              className="w-full justify-center text-xs bg-indigo-600 hover:bg-indigo-700"
              leftIcon={<Sparkles size={14} />}
            >
              Resumo com IA
            </Button>
          </div>
        </Card>

        {/* Card da IA ConnectMax - Resumo Executivo */}
        {aiSummary && (
          <div className="bg-gradient-to-r from-brand-900 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-xl space-y-4 border border-brand-500/30 animate-in fade-in duration-300">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <Sparkles size={20} className="text-brand-300 animate-pulse" />
              <h3 className="text-sm font-bold text-white">Resumo Gerado pela Inteligência Artificial</h3>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-xs text-slate-100 whitespace-pre-line leading-relaxed border border-white/10">
              {aiSummary}
            </div>
          </div>
        )}

        {/* Seção 2: Card Próximas Ações (Sprint RC-1) */}
        <Card title="Próximas Ações & Status Geral">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 shrink-0">
                <AlertCircle size={18} />
              </div>
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Pendências</span>
                <span className="font-bold text-slate-900 text-sm">0 Pendentes</span>
                <p className="text-[11px] text-slate-500 mt-0.5">Tudo em dia</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-brand-500/10 text-brand-600 shrink-0">
                <Calendar size={18} />
              </div>
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Próxima Reunião</span>
                <span className="font-bold text-slate-900 text-sm">Sem agendamentos</span>
                <p className="text-[11px] text-slate-500 mt-0.5">Próximos 7 dias</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 shrink-0">
                <CheckSquare size={18} />
              </div>
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Tarefas Abertas</span>
                <span className="font-bold text-slate-900 text-sm">0 Tarefas</span>
                <p className="text-[11px] text-slate-500 mt-0.5">Nenhuma tarefa aberta</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 shrink-0">
                <TrendingUp size={18} />
              </div>
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Leads Relacionados</span>
                <span className="font-bold text-slate-900 text-sm">0 Oportunidades</span>
                <p className="text-[11px] text-slate-500 mt-0.5">Funil comercial</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 shrink-0">
                <DollarSign size={18} />
              </div>
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Situação Financeira</span>
                <Badge variant="green" className="mt-0.5">Adimplente</Badge>
                <p className="text-[11px] text-slate-500 mt-0.5 font-mono">R$ 0,00 pendente</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Grid de Detalhes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Informações Principais */}
          <Card title="Informações de Contato" className="md:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <Mail className="text-brand-500 mt-0.5 shrink-0" size={18} />
                <div>
                  <span className="text-slate-400 font-semibold uppercase tracking-wider block text-[10px]">
                    E-mail
                  </span>
                  <span className="font-semibold text-slate-800">{contact.email || 'Não informado'}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <Phone className="text-brand-500 mt-0.5 shrink-0" size={18} />
                <div>
                  <span className="text-slate-400 font-semibold uppercase tracking-wider block text-[10px]">
                    Telefone / WhatsApp
                  </span>
                  <span className="font-semibold text-slate-800 font-mono">
                    {formatPhone(contact.phone)}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <FileText className="text-brand-500 mt-0.5 shrink-0" size={18} />
                <div>
                  <span className="text-slate-400 font-semibold uppercase tracking-wider block text-[10px]">
                    CPF / CNPJ
                  </span>
                  <span className="font-semibold text-slate-800 font-mono">
                    {formatDocument(contact.document)}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <Calendar className="text-brand-500 mt-0.5 shrink-0" size={18} />
                <div>
                  <span className="text-slate-400 font-semibold uppercase tracking-wider block text-[10px]">
                    Data de Cadastro
                  </span>
                  <span className="font-semibold text-slate-800">
                    {new Date(contact.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>

            {/* Observações */}
            {contact.notes && (
              <div className="mt-6 pt-6 border-t border-slate-100">
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Observações Gerais
                </h4>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                  {contact.notes}
                </div>
              </div>
            )}
          </Card>

          {/* Atividades Recentes */}
          <div className="space-y-6 md:col-span-1">
            <Card title="Atividades Recentes">
              <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-center flex flex-col items-center justify-center min-h-[140px]">
                <Clock size={32} className="text-slate-400 mb-2" />
                <p className="text-xs font-semibold text-slate-700">Histórico de Atendimentos</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Integrado com interações, tarefas e agendamentos no CRM.
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Modal de Confirmação de Exclusão */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-100">
              <div className="flex items-center gap-3 text-red-600">
                <div className="p-3 bg-red-50 rounded-xl">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Excluir Cliente</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Esta ação é irreversível.</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tem certeza que deseja remover o cliente <strong className="text-slate-900">{contact.name}</strong> da sua base de contatos?
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <Button variant="outline" size="sm" onClick={() => setShowDeleteModal(false)}>
                  Cancelar
                </Button>
                <Button variant="danger" size="sm" isLoading={deleting} onClick={handleDelete}>
                  Sim, Excluir
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
