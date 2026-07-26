'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
import { api } from '../../../services/api';
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
  Loader2,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function ContactDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [contact, setContact] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const handleGenerateAiSummary = async () => {
    setAiLoading(true);
    try {
      const response = await api.post(`/ai/contacts/${id}/summary`);
      setAiSummary(response.data.summary);
    } catch (err) {
      console.error('Erro ao gerar resumo de IA:', err);
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    async function loadContact() {
      try {
        const response = await api.get(`/contacts/${id}`);
        setContact(response.data);
      } catch (err) {
        console.error('Erro ao carregar detalhes do contato:', err);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadContact();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja remover este cliente?')) return;
    setDeleting(true);
    try {
      await api.delete(`/contacts/${id}`);
      router.push('/contacts');
    } catch (err) {
      console.error('Erro ao excluir contato:', err);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex py-24 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
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
            <Button variant="danger" size="sm" isLoading={deleting} onClick={handleDelete} leftIcon={<Trash2 size={16} />}>
              Excluir
            </Button>
          </div>
        </div>

        {/* Card Header do Cliente */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-brand-500/10 text-brand-600 font-bold text-2xl flex items-center justify-center border-2 border-brand-500/20 shrink-0">
              {contact.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900">{contact.name}</h1>
                <Badge variant={contact.type === 'COMPANY' ? 'blue' : 'slate'}>
                  {contact.type === 'COMPANY' ? 'Pessoa Jurídica' : 'Pessoa Física'}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                {contact.companyName && <span>Empresa: <strong>{contact.companyName}</strong></span>}
                {contact.position && <span>• Cargo: <strong>{contact.position}</strong></span>}
              </p>
            </div>
          </div>

          <div>
            <Badge variant={contact.status === 'ACTIVE' ? 'green' : contact.status === 'LEAD' ? 'amber' : 'slate'}>
              Status: {contact.status === 'ACTIVE' ? 'Ativo' : contact.status === 'LEAD' ? 'Lead' : 'Inativo'}
            </Badge>
          </div>
        </div>

        {/* Card da IA ConnectMax - Resumo Executivo */}
        <div className="bg-gradient-to-r from-brand-900 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-xl space-y-4 border border-brand-500/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-brand-500/20 text-brand-300 flex items-center justify-center border border-brand-400/30">
                <Sparkles size={20} className="animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">ConnectMax IA • Resumo Inteligente</h3>
                <p className="text-xs text-slate-300">Análise sintética do histórico e recomendações comerciais</p>
              </div>
            </div>
            <Button
              variant="primary"
              size="sm"
              isLoading={aiLoading}
              onClick={handleGenerateAiSummary}
              leftIcon={<Sparkles size={16} />}
            >
              {aiSummary ? 'Regerar Resumo' : 'Gerar Resumo com IA'}
            </Button>
          </div>

          {aiSummary ? (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-xs text-slate-100 whitespace-pre-line leading-relaxed border border-white/10">
              {aiSummary}
            </div>
          ) : (
            <p className="text-xs text-slate-300 italic">
              Clique no botão acima para a IA analisar todas as interações, oportunidades e pendências deste cliente e sintetizar em segundos.
            </p>
          )}
        </div>

        {/* Grid de Detalhes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Informações Principais */}
          <Card title="Informações de Contato" className="md:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <Mail className="text-brand-500 mt-0.5 shrink-0" size={18} />
                <div>
                  <span className="text-slate-400 font-semibold uppercase tracking-wider block text-[10px]">E-mail</span>
                  <span className="font-semibold text-slate-800">{contact.email || 'Não informado'}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <Phone className="text-brand-500 mt-0.5 shrink-0" size={18} />
                <div>
                  <span className="text-slate-400 font-semibold uppercase tracking-wider block text-[10px]">Telefone</span>
                  <span className="font-semibold text-slate-800">{contact.phone || 'Não informado'}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <FileText className="text-brand-500 mt-0.5 shrink-0" size={18} />
                <div>
                  <span className="text-slate-400 font-semibold uppercase tracking-wider block text-[10px]">CPF / CNPJ</span>
                  <span className="font-semibold text-slate-800 font-mono">{contact.document || 'Não informado'}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <Calendar className="text-brand-500 mt-0.5 shrink-0" size={18} />
                <div>
                  <span className="text-slate-400 font-semibold uppercase tracking-wider block text-[10px]">Data de Cadastro</span>
                  <span className="font-semibold text-slate-800">
                    {new Date(contact.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>

            {/* Observações */}
            {contact.notes && (
              <div className="mt-6 pt-6 border-t border-slate-100">
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Observações Gerais</h4>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                  {contact.notes}
                </div>
              </div>
            )}
          </Card>

          {/* Espaço Preparado para Oportunidades & Histórico no CRM */}
          <div className="space-y-6 md:col-span-1">
            <Card title="Atividades Recentes">
              <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-center flex flex-col items-center justify-center min-h-[140px]">
                <Clock size={32} className="text-slate-400 mb-2" />
                <p className="text-xs font-semibold text-slate-700">Histórico de Atendimentos</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Preparado para integrar futuras interações, ligações e automações de IA.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
