'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { Logo } from '../../components/Logo';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Building2, FileText, Mail, Phone, User, Lock, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';

function RegisterForm() {
  const { registerCompany, user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  console.log('[DEBUG RegisterForm] Rendering. user:', user, 'authLoading:', authLoading);
  const planParam = searchParams.get('plan') || 'Starter';

  const [formData, setFormData] = useState({
    companyName: '',
    document: '',
    companyEmail: '',
    phone: '',
    adminName: '',
    adminEmail: '',
    adminPassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (
      !formData.companyName ||
      !formData.document ||
      !formData.companyEmail ||
      !formData.adminName ||
      !formData.adminEmail ||
      !formData.adminPassword
    ) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);
    try {
      await registerCompany({
        ...formData,
        planName: planParam,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao realizar cadastro da empresa. Verifique os dados fornecidos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-xl relative z-10">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center mb-6">
        <div className="flex justify-center mb-6">
          <Logo variant="dark" size="lg" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Criar Nova Conta SaaS Multi-Tenant</h2>
        <p className="mt-2 text-xs text-slate-400">
          Cadastre sua empresa e crie o primeiro perfil de Administrador em menos de 1 minuto.
        </p>

        {/* Selected Plan / Trial Badge */}
        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <Sparkles size={14} />
          <span>Ativando 14 Dias Grátis no Plano: <strong className="underline">{planParam}</strong></span>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-md py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-3">
            <AlertCircle size={18} className="shrink-0 text-red-400 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Seção Empresa */}
          <div>
            <h3 className="text-sm font-semibold text-brand-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Building2 size={16} /> 1. Dados da Empresa
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nome da Empresa *"
                name="companyName"
                placeholder="Minha Empresa S.A."
                value={formData.companyName}
                onChange={handleChange}
                leftIcon={<Building2 size={18} />}
                required
              />
              <Input
                label="CNPJ *"
                name="document"
                placeholder="00.000.000/0001-00"
                value={formData.document}
                onChange={handleChange}
                leftIcon={<FileText size={18} />}
                required
              />
              <Input
                label="E-mail da Empresa *"
                name="companyEmail"
                type="email"
                placeholder="contato@empresa.com"
                value={formData.companyEmail}
                onChange={handleChange}
                leftIcon={<Mail size={18} />}
                required
              />
              <Input
                label="Telefone (Opcional)"
                name="phone"
                placeholder="(11) 98888-7777"
                value={formData.phone}
                onChange={handleChange}
                leftIcon={<Phone size={18} />}
              />
            </div>
          </div>

          {/* Seção Administrador */}
          <div className="pt-4 border-t border-slate-800/80">
            <h3 className="text-sm font-semibold text-brand-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <User size={16} /> 2. Administrador Principal (Company Admin)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nome Completo *"
                name="adminName"
                placeholder="João Silva"
                value={formData.adminName}
                onChange={handleChange}
                leftIcon={<User size={18} />}
                required
              />
              <Input
                label="E-mail do Administrador *"
                name="adminEmail"
                type="email"
                placeholder="joao.silva@empresa.com"
                value={formData.adminEmail}
                onChange={handleChange}
                leftIcon={<Mail size={18} />}
                required
              />
            </div>
            <div className="mt-4">
              <Input
                label="Senha de Acesso *"
                name="adminPassword"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={formData.adminPassword}
                onChange={handleChange}
                leftIcon={<Lock size={18} />}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-6 shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 transition-all duration-300"
            isLoading={loading}
            rightIcon={<CheckCircle2 size={18} />}
          >
            Concluir Cadastro e Acessar Painel
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-450">
            Já possui uma empresa cadastrada?{' '}
            <a href="/login" className="font-semibold text-brand-400 hover:text-brand-300 underline underline-offset-4">
              Fazer Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-950 text-white relative overflow-hidden">
      {/* Background neon glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(circle_at_center,_rgba(37,99,235,0.08)_0%,_transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

      <Suspense fallback={
        <div className="text-center py-12">
          <p className="text-sm text-slate-400">Carregando formulário...</p>
        </div>
      }>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
