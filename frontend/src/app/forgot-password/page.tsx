'use client';

import React, { useState } from 'react';
import { api } from '../../services/api';
import { Logo } from '../../components/Logo';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/forgot-password', { email });
      setMessage(response.data.message);
    } catch (err: any) {
      setMessage('Ocorreu um erro ao solicitar a recuperação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-900 text-white relative overflow-hidden">
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <div className="flex justify-center mb-6">
          <Logo variant="dark" size="lg" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Recuperação de Senha</h2>
        <p className="mt-2 text-xs text-slate-400">
          Informe o e-mail associado à sua conta de usuário.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="dark-glass-card py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
          {message ? (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-start gap-3 mb-6">
              <CheckCircle2 size={18} className="shrink-0 text-emerald-400 mt-0.5" />
              <span>{message}</span>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <Input
                label="E-mail de Acesso"
                type="email"
                placeholder="seu.email@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail size={18} />}
                required
              />

              <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={loading}>
                Enviar Instruções de Recuperação
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <a href="/login" className="inline-flex items-center gap-2 text-xs font-semibold text-brand-400 hover:text-brand-300">
              <ArrowLeft size={14} /> Voltar para a tela de login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
