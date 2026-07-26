'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';
import { Card } from '../../../../components/Card';
import { Button } from '../../../../components/Button';
import { Badge } from '../../../../components/Badge';
import { api } from '../../../../services/api';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Building2,
  Phone,
  Mail,
  User,
  Sparkles,
  Clipboard,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';

export default function LeadDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const leadId = params.id as string;

  const [lead, setLead] = useState<any>(null);
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [converting, setConverting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Editable fields
  const [status, setStatus] = useState('');
  const [responsibleId, setResponsibleId] = useState('');
  const [notes, setNotes] = useState('');

  const fetchLeadDetails = async () => {
    setLoading(true);
    try {
      const [leadRes, vendorsRes] = await Promise.all([
        api.get(`/admin/commercial-leads/${leadId}`),
        api.get('/admin/commercial-vendors'),
      ]);

      const leadData = leadRes.data;
      setLead(leadData);
      setStatus(leadData.status);
      setResponsibleId(leadData.responsibleId || '');
      setNotes(leadData.notes || '');

      setVendors(vendorsRes.data || []);
    } catch (err) {
      console.error('Erro ao buscar detalhes do lead comercial:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (leadId) fetchLeadDetails();
  }, [leadId]);

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    try {
      await api.patch(`/admin/commercial-leads/${leadId}`, {
        status,
        notes,
        responsibleId: responsibleId || null,
      });
      alert('Alterações salvas com sucesso!');
      fetchLeadDetails();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Erro ao salvar alterações.');
    } finally {
      setSaving(false);
    }
  };

  const handleConvertLead = async () => {
    if (!window.confirm('Confirma a conversão deste lead comercial em Cliente SaaS do ConnectMax?')) return;
    setConverting(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await api.post(`/admin/commercial-leads/${leadId}/convert`);
      setSuccessMsg(
        `🎉 Sucesso! Ambiente criado para ${res.data.company.name}. Administrador registrado no e-mail: ${lead.email}. Assinatura Trial ativada.`
      );
      fetchLeadDetails();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Erro ao converter lead comercial.');
    } finally {
      setConverting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="py-24 text-center text-xs text-slate-500">Buscando detalhes do lead comercial...</div>
      </DashboardLayout>
    );
  }

  if (!lead) {
    return (
      <DashboardLayout>
        <div className="py-24 text-center text-xs text-red-500">Lead comercial não encontrado.</div>
      </DashboardLayout>
    );
  }

  const kanbanStatuses = [
    'Novo Lead',
    'Contato Inicial',
    'Demonstração Agendada',
    'Proposta Enviada',
    'Negociação',
    'Cliente Ativo',
    'Perdido',
  ];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Back Link */}
        <Link href="/admin/commercial-sales" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft size={16} /> Voltar para o Funil de Vendas
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              {lead.name}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Organização: <strong className="text-slate-700">{lead.companyName}</strong> | Registrado em:{' '}
              {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
            </p>
          </div>
          <Badge variant={lead.status === 'Cliente Ativo' ? 'green' : 'blue'}>
            {lead.status}
          </Badge>
        </div>

        {/* FEEDBACK BANNERS */}
        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-3">
            <CheckCircle className="shrink-0 text-emerald-600 mt-0.5" size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-3">
            <XCircle className="shrink-0 text-red-600 mt-0.5" size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna 1: Dados do Lead */}
          <div className="space-y-6 lg:col-span-1">
            <Card title="Informações de Contato">
              <div className="space-y-4 py-2 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-400 block">Razão Social / Empresa:</span>
                  <strong className="text-slate-800 flex items-center gap-1.5">
                    <Building2 size={14} className="text-slate-400" /> {lead.companyName}
                  </strong>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 block">E-mail:</span>
                  <strong className="text-slate-800 flex items-center gap-1.5">
                    <Mail size={14} className="text-slate-400" /> {lead.email}
                  </strong>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 block">WhatsApp:</span>
                  <strong className="text-slate-800 flex items-center gap-1.5">
                    <Phone size={14} className="text-slate-400" /> {lead.phone}
                  </strong>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 block">Plano Comercial Alvo:</span>
                  <strong className="text-slate-800 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-brand-500" /> {lead.planName} (Até {lead.usersCount} usuários)
                  </strong>
                </div>
              </div>
            </Card>

            {lead.status !== 'Cliente Ativo' && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg space-y-3.5 border border-emerald-500/20">
                <div className="space-y-1">
                  <strong className="text-sm block font-bold">Converter em Cliente?</strong>
                  <p className="text-[10px] text-emerald-105 leading-relaxed">
                    Cria automaticamente o tenant, usuário administrador, assinatura e ambiente isolado na base multi-tenant.
                  </p>
                </div>
                <Button
                  variant="primary"
                  className="w-full bg-white text-emerald-700 hover:bg-slate-50 font-bold border-none"
                  isLoading={converting}
                  onClick={handleConvertLead}
                  rightIcon={<ArrowRight size={16} />}
                >
                  Converter Agora
                </Button>
              </div>
            )}
          </div>

          {/* Coluna 2: Formulário de Acompanhamento */}
          <div className="lg:col-span-2">
            <Card title="Acompanhamento Comercial">
              <form onSubmit={handleSaveChanges} className="space-y-5 py-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-750 block">Status Comercial</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full h-10 rounded-lg bg-slate-50 border border-slate-250 px-3 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    >
                      {kanbanStatuses.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-750 block">Vendedor Responsável</label>
                    <select
                      value={responsibleId}
                      onChange={(e) => setResponsibleId(e.target.value)}
                      className="w-full h-10 rounded-lg bg-slate-50 border border-slate-250 px-3 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    >
                      <option value="">Sem Atribuição</option>
                      {vendors.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-750 block">Notas & Observações Comerciais</label>
                  <textarea
                    rows={6}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Histórico de ligações, propostas enviadas e alinhamentos da demonstração..."
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>

                <Button variant="primary" type="submit" isLoading={saving} className="w-full py-3">
                  Salvar Observações
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// Simulated XCircle component
function XCircle({ size, className }: { size?: number; className?: string }) {
  return <ShieldCheck size={size} className={className} />;
}
