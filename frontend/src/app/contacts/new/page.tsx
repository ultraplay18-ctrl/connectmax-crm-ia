'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { Card } from '../../../components/Card';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { api } from '../../../services/api';
import { Users, User, Mail, Phone, FileText, Building, Briefcase, FileCode, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export default function NewContactPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    document: '',
    type: 'INDIVIDUAL',
    companyName: '',
    position: '',
    notes: '',
    status: 'ACTIVE',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name) {
      setError('O nome do contato é obrigatório.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/contacts', formData);
      router.push('/contacts');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao cadastrar contato. Verifique os dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Topbar */}
        <div className="flex items-center gap-4">
          <a href="/contacts">
            <Button variant="outline" size="sm" leftIcon={<ArrowLeft size={16} />}>
              Voltar
            </Button>
          </a>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              Cadastrar Novo Cliente / Contato
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">Preencha as informações para adicionar um novo cliente à sua empresa.</p>
          </div>
        </div>

        <Card title="Dados do Cliente">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-3">
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
                  onClick={() => setFormData({ ...formData, type: 'INDIVIDUAL' })}
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
                  onClick={() => setFormData({ ...formData, type: 'COMPANY' })}
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
              <Input
                label="Nome Completo ou Razão Social *"
                name="name"
                placeholder="Ex: Carlos Silva ou Tech Solution Ltda"
                value={formData.name}
                onChange={handleChange}
                leftIcon={<User size={18} />}
                required
              />

              <Input
                label={formData.type === 'COMPANY' ? 'CNPJ' : 'CPF'}
                name="document"
                placeholder={formData.type === 'COMPANY' ? '00.000.000/0001-00' : '000.000.000-00'}
                value={formData.document}
                onChange={handleChange}
                leftIcon={<FileText size={18} />}
              />

              <Input
                label="E-mail de Contato"
                name="email"
                type="email"
                placeholder="cliente@empresa.com"
                value={formData.email}
                onChange={handleChange}
                leftIcon={<Mail size={18} />}
              />

              <Input
                label="Telefone / WhatsApp"
                name="phone"
                placeholder="(11) 98888-7777"
                value={formData.phone}
                onChange={handleChange}
                leftIcon={<Phone size={18} />}
              />
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
                Status Inicial no CRM
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
              <a href="/contacts">
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </a>
              <Button type="submit" variant="primary" isLoading={loading} rightIcon={<CheckCircle2 size={18} />}>
                Salvar Cliente
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
