import React, { useState } from 'react';
import { Input } from '../Input';
import { Button } from '../Button';
import { maskDocumentInput, maskPhoneInput, isValidEmail, isValidCPF, isValidCNPJ } from '../../utils/formatters';
import { User, Mail, Phone, FileText, Building, Briefcase, CheckCircle2, AlertCircle } from 'lucide-react';

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  document: string;
  type: 'INDIVIDUAL' | 'COMPANY';
  companyName: string;
  position: string;
  notes: string;
  status: 'ACTIVE' | 'INACTIVE' | 'LEAD';
}

interface ContactFormProps {
  initialValues?: ContactFormData;
  onSubmit: (data: ContactFormData) => Promise<void>;
  isLoading: boolean;
  cancelHref: string;
  submitButtonText?: string;
}

const defaultValues: ContactFormData = {
  name: '',
  email: '',
  phone: '',
  document: '',
  type: 'INDIVIDUAL',
  companyName: '',
  position: '',
  notes: '',
  status: 'ACTIVE',
};

export const ContactForm: React.FC<ContactFormProps> = ({
  initialValues = defaultValues,
  onSubmit,
  isLoading,
  cancelHref,
  submitButtonText = 'Salvar Cliente',
}) => {
  const [formData, setFormData] = useState<ContactFormData>(initialValues);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
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
      errors.email = 'Insira um endereço de e-mail válido (ex: cliente@empresa.com).';
    }

    if (formData.document.trim()) {
      const cleanDoc = formData.document.replace(/\D/g, '');
      if (formData.type === 'INDIVIDUAL') {
        if (cleanDoc.length !== 11 || !isValidCPF(formData.document)) {
          errors.document = 'CPF inválido. Verifique os números digitados.';
        }
      } else {
        if (cleanDoc.length !== 14 || !isValidCNPJ(formData.document)) {
          errors.document = 'CNPJ inválido. Verifique os números digitados.';
        }
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      setError('Por favor, corrija os erros nos campos destacados antes de prosseguir.');
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err: any) {
      console.error('Erro no formulário de contato:', err);
      const backendMessage = err.response?.data?.message;
      if (Array.isArray(backendMessage)) {
        setError(backendMessage.join(' | '));
      } else {
        setError(backendMessage || 'Erro ao processar requisição. Tente novamente.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmitForm} className="space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-3 animate-in fade-in">
          <AlertCircle size={18} className="shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

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
            placeholder="Ex: Carlos Silva ou Tech Solution Ltda"
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
            placeholder={formData.type === 'COMPANY' ? '00.000.000/0001-00' : '000.000.000-00'}
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
            placeholder="cliente@empresa.com"
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
            placeholder="(11) 98888-7777"
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
          placeholder="Empresa onde o contato trabalha"
          value={formData.companyName}
          onChange={handleChange}
          leftIcon={<Building size={18} />}
        />

        <Input
          label="Cargo / Função"
          name="position"
          placeholder="Ex: Diretor Comercial, Gerente"
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
          placeholder="Adicione histórico, preferências do cliente ou detalhes importantes..."
          value={formData.notes}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
        />
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
        <a href={cancelHref}>
          <Button type="button" variant="outline">
            Cancelar
          </Button>
        </a>
        <Button type="submit" variant="primary" isLoading={isLoading} rightIcon={<CheckCircle2 size={18} />}>
          {submitButtonText}
        </Button>
      </div>
    </form>
  );
};
