'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';
import { Card } from '../../../../components/Card';
import { Input } from '../../../../components/Input';
import { Button } from '../../../../components/Button';
import { Skeleton } from '../../../../components/Skeleton';
import { Toast, ToastProps } from '../../../../components/Toast';
import { api } from '../../../../services/api';
import { maskDocumentInput, maskPhoneInput, isValidEmail, isValidCPF, isValidCNPJ } from '../../../../utils/formatters';
import { User, Mail, Phone, FileText, Building, Briefcase, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function EditContactPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    document: '',
    type: 'INDIVIDUAL' as 'INDIVIDUAL' | 'COMPANY',
    companyName: '',
    position: '',
    notes: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE' | 'LEAD',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<Omit<ToastProps, 'onClose'> | null>(null);

  useEffect(() => {
    async function loadContact() {
      try {
        const response = await api.get(`/contacts/${id}`);
        const c = response.data;
        setFormData({
          name: c.name || '',
          email: c.email || '',
          phone: c.phone ? maskPhoneInput(c.phone) : '',
          document: c.document ? maskDocumentInput(c.document) : '',
          type: c.type || 'INDIVIDUAL',
          companyName: c.companyName || '',
          position: c.position || '',
          notes: c.notes || '',
          status: c.status || 'ACTIVE',
        });
      } catch (err: any) {
        console.error('Erro ao carregar contato:', err);
        const msg = err.response?.data?.message || 'Erro ao buscar dados do cliente.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadContact();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'document') {
      formattedValue = maskDocumentInput(value);
    } else if (name === 'phone') {
      formattedValue = maskPhoneInput(value);
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'O nome do cliente ou razão social é obrigatório.';
    }

    if (formData.email.trim() && !isValidEmail(formData.email)) {
      errors.email = 'Insira um endereço de e-mail válido.';
    }

    if (formData.document.trim()) {
      const cleanDoc = formData.document.replace(/\D/g, '');
      if (formData.type === 'INDIVIDUAL') {
        if (cleanDoc.length !== 11 || !isValidCPF(formData.document)) {
          errors.document = 'CPF inválido.';
        }
      } else {
        if (cleanDoc.length !== 14 || !isValidCNPJ(formData.document)) {
          errors.document = 'CNPJ inválido.';
        }
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      setError('Por favor, corrija os erros destacadas antes de salvar.');
      return;
    }

    setSaving(true);
    try {
      await api.patch(`/contacts/${id}`, formData);
      router.push(`/contacts/${id}`);
    } catch (err: any) {
      console.error('Erro ao atualizar contato:', err);
      const backendMessage = err.response?.data?.message;
      if (Array.isArray(backendMessage)) {
        setError(backendMessage.join(' | '));
      } else {
        setError(backendMessage || 'Erro ao atualizar cliente.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-8 w-48" />
          </div>
          <Card>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </Card>
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
        <div className="flex items-center gap-4">
          <a href={`/contacts/${id}`}>
            <Button variant="outline" size="sm" leftIcon={<ArrowLeft size={16} />}>
              Cancelar
            </Button>
          </a>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Editar Cliente</h1>
            <p className="text-xs text-slate-500 mt-0.5">Atualize as informações do cliente na sua empresa.</p>
          </div>
        </div>

        <Card title="Editar Dados do Cliente">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-3">
              <AlertCircle size={18} className="shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tipo de Cliente */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Tipo de Pessoa *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'INDIVIDUAL', document: '' })}
                  className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-all ${
                    formData.type === 'INDIVIDUAL'
                      ? 'border-brand-500 bg-brand-500/10 text-brand-600 font-semibold ring-2 ring-brand-500/20'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <User size={20} />
                  <div>
                    <p className="text-sm font-semibold">Pessoa Física</p>
                    <p className="text-xs text-slate-500">CPF, contatos diretos</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'COMPANY', document: '' })}
                  className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-all ${
                    formData.type === 'COMPANY'
                      ? 'border-brand-500 bg-brand-500/10 text-brand-600 font-semibold ring-2 ring-brand-500/20'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Building size={20} />
                  <div>
                    <p className="text-sm font-semibold">Pessoa Jurídica</p>
                    <p className="text-xs text-slate-500">CNPJ, empresas clientes</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Informações Básicas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Nome Completo ou Razão Social *"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  leftIcon={<User size={18} />}
                  required
                />
                {fieldErrors.name && (
                  <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {fieldErrors.name}
                  </p>
                )}
              </div>

              <div>
                <Input
                  label={formData.type === 'COMPANY' ? 'CNPJ' : 'CPF'}
                  name="document"
                  value={formData.document}
                  onChange={handleChange}
                  leftIcon={<FileText size={18} />}
                />
                {fieldErrors.document && (
                  <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {fieldErrors.document}
                  </p>
                )}
              </div>

              <div>
                <Input
                  label="E-mail de Contato"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  leftIcon={<Mail size={18} />}
                />
                {fieldErrors.email && (
                  <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {fieldErrors.email}
                  </p>
                )}
              </div>

              <div>
                <Input
                  label="Telefone / WhatsApp"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  leftIcon={<Phone size={18} />}
                />
              </div>
            </div>

            {/* Empresa e Cargo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nome da Empresa (se aplicável)"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                leftIcon={<Building size={18} />}
              />

              <Input
                label="Cargo / Função"
                name="position"
                value={formData.position}
                onChange={handleChange}
                leftIcon={<Briefcase size={18} />}
              />
            </div>

            {/* Status */}
            <div className="w-full space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Status no CRM
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              >
                <option value="ACTIVE">Ativo (Cliente Confirmado)</option>
                <option value="LEAD">Lead (Em Negociação)</option>
                <option value="INACTIVE">Inativo</option>
              </select>
            </div>

            {/* Observações */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Observações Adicionais
              </label>
              <textarea
                name="notes"
                rows={4}
                value={formData.notes}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <a href={`/contacts/${id}`}>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </a>
              <Button type="submit" variant="primary" isLoading={saving} rightIcon={<CheckCircle2 size={18} />}>
                Salvar Alterações
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
