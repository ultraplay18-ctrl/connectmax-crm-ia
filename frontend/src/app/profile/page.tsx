'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';
import { User, Mail, Lock, Building2, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { Badge } from '../../components/Badge';

export default function ProfilePage() {
  const { user, refetchUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      await api.patch('/users/me', {
        name,
        email,
        ...(password ? { password } : {}),
      });

      await refetchUser();
      setMessage('Perfil atualizado com sucesso!');
      setPassword('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar perfil.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Perfil do Usuário</h1>
          <p className="text-xs text-slate-500 mt-1">Gerencie suas informações pessoais e credenciais de acesso.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card Resumo do Perfil */}
          <Card className="md:col-span-1">
            <div className="flex flex-col items-center text-center p-4">
              <div className="h-20 w-20 rounded-full bg-brand-500/10 text-brand-600 font-bold text-2xl flex items-center justify-center border-2 border-brand-500/20 mb-4">
                {user?.name ? user.name.charAt(0).toUpperCase() : <User size={32} />}
              </div>
              <h3 className="text-lg font-bold text-slate-900">{user?.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>

              <div className="mt-4 flex flex-col gap-2 w-full pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Nível de Acesso</span>
                  <Badge variant={user?.role === 'SUPER_ADMIN' ? 'red' : 'blue'}>{user?.role}</Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">ID da Empresa</span>
                  <span className="font-mono text-slate-700">{user?.companyId?.substring(0, 8)}...</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Form de Edição */}
          <Card title="Editar Dados Pessoais" className="md:col-span-2">
            {message && (
              <div className="mb-4 p-3 rounded-lg bg-emerald-50 text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle2 size={16} /> {message}
              </div>
            )}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-4">
              <Input
                label="Nome Completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                leftIcon={<User size={18} />}
                required
              />

              <Input
                label="E-mail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail size={18} />}
                required
              />

              <Input
                label="Nova Senha (deixe em branco para manter a atual)"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock size={18} />}
              />

              <div className="pt-2">
                <Button type="submit" variant="primary" isLoading={loading}>
                  Salvar Alterações
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
