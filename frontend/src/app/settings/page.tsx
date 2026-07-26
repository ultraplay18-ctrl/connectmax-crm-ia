'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { api } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { Building2, Palette, Globe, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react';
import { Badge } from '../../components/Badge';

export default function SettingsPage() {
  const { user } = useAuth();
  const [logo, setLogo] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#2563EB');
  const [timezone, setTimezone] = useState('America/Sao_Paulo');

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const isAllowedToEdit = user?.role === 'SUPER_ADMIN' || user?.role === 'COMPANY_ADMIN';

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await api.get('/settings');
        if (response.data) {
          setLogo(response.data.logo || '');
          setPrimaryColor(response.data.primaryColor || '#2563EB');
          setTimezone(response.data.timezone || 'America/Sao_Paulo');
        }
      } catch (err) {
        console.error('Erro ao carregar configurações:', err);
      } finally {
        setFetching(false);
      }
    }

    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      await api.patch('/settings', {
        logo,
        primaryColor,
        timezone,
      });

      setMessage('Configurações salvas com sucesso!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao salvar configurações.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Configurações da Empresa</h1>
          <p className="text-xs text-slate-500 mt-1">Personalize a identidade visual e parâmetros do seu tenant SaaS.</p>
        </div>

        {!isAllowedToEdit && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-3">
            <ShieldAlert size={20} className="shrink-0 text-amber-600" />
            <span>Apenas administradores da empresa (`COMPANY_ADMIN`) ou Super Admins têm permissão para editar estas configurações.</span>
          </div>
        )}

        <Card title="Identidade Visual & Preferências">
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

          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-4">
              <Input
                label="URL da Logomarca"
                placeholder="https://suaempresa.com/logo.png"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                disabled={!isAllowedToEdit || fetching}
                leftIcon={<Building2 size={18} />}
                helperText="URL de uma imagem transparente nos formatos PNG ou SVG."
              />

              <div className="w-full space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Cor Primária da Marca
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    disabled={!isAllowedToEdit || fetching}
                    className="h-10 w-14 rounded border border-slate-300 cursor-pointer p-0.5"
                  />
                  <Input
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    disabled={!isAllowedToEdit || fetching}
                    leftIcon={<Palette size={18} />}
                  />
                </div>
              </div>

              <Input
                label="Fuso Horário Padrão"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                disabled={!isAllowedToEdit || fetching}
                leftIcon={<Globe size={18} />}
                helperText="Fuso horário utilizado para emissão de relatórios e métricas da IA."
              />
            </div>

            {isAllowedToEdit && (
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <Button type="submit" variant="primary" isLoading={loading}>
                  Salvar Preferências
                </Button>
              </div>
            )}
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
