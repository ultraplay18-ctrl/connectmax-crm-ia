'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';
import { AiStudioHeader } from '../../../../components/ai-studio/AiStudioHeader';
import { MemoryCenterNavigation } from '../../../../components/ai-studio/MemoryCenterNavigation';
import { Button } from '../../../../components/Button';
import { Input } from '../../../../components/Input';
import { api } from '../../../../services/api';
import { UserCheck, Plus, Search, Star, Building, Sparkles, X } from 'lucide-react';

export default function MemoryProfilesPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    customerName: '',
    companyName: '',
    preferences: '',
    language: 'pt-BR',
    toneOfVoice: 'Profissional',
    interestedItems: '',
    lastPurchase: '',
    satisfactionScore: 5.0,
    notes: '',
  });

  useEffect(() => {
    fetchProfiles();
  }, [search]);

  const fetchProfiles = async () => {
    try {
      const res = await api.get(`/ai-studio/memory-center/profiles?search=${search}`);
      setProfiles(res.data || []);
    } catch (err) {
      console.error('Erro ao carregar perfis inteligentes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerName.trim()) return;

    try {
      await api.post('/ai-studio/memory-center/profiles', form);
      setIsModalOpen(false);
      setForm({ customerName: '', companyName: '', preferences: '', language: 'pt-BR', toneOfVoice: 'Profissional', interestedItems: '', lastPurchase: '', satisfactionScore: 5.0, notes: '' });
      fetchProfiles();
    } catch (err) {
      console.error('Erro ao cadastrar perfil inteligente:', err);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <AiStudioHeader
          title="Perfis Inteligentes de Clientes"
          subtitle="Acompanhe preferências, histórico de compras, hábitos e tom de voz de cada cliente."
          activeTab="Memória"
          action={
            <Button variant="primary" leftIcon={<Plus size={18} />} onClick={() => setIsModalOpen(true)}>
              Novo Perfil de Cliente
            </Button>
          }
        />

        <MemoryCenterNavigation />

        {/* Busca */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <Input
            placeholder="Buscar perfil por cliente, empresa ou preferências..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search size={18} />}
          />
        </div>

        {/* Grid de Perfis */}
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs">Carregando perfis inteligentes...</div>
        ) : profiles.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-3 max-w-md mx-auto my-8">
            <UserCheck size={36} className="mx-auto text-slate-400" />
            <h3 className="text-sm font-bold text-slate-900">Nenhum Perfil Encontrado</h3>
            <p className="text-xs text-slate-500">Cadastre um novo perfil inteligente para memorizar dados do cliente.</p>
            <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
              Criar Perfil
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((prof) => (
              <div key={prof.id} className="bg-white rounded-3xl border border-slate-200/80 p-5 space-y-4 shadow-sm hover:shadow-lg transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{prof.customerName}</h4>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Building size={14} /> {prof.companyName || 'Cliente Individual'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200 text-xs font-bold">
                    <Star size={12} className="fill-amber-500" /> {prof.satisfactionScore}
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600">
                  <div>
                    <strong className="text-slate-800">Preferências:</strong> {prof.preferences || 'Preferência por WhatsApp e mensagens diretas'}
                  </div>
                  <div>
                    <strong className="text-slate-800">Produtos de Interesse:</strong> {prof.interestedItems || 'Módulo CRM e Automação de IA'}
                  </div>
                  <div>
                    <strong className="text-slate-800">Tom Recomendado:</strong> {prof.toneOfVoice || 'Profissional'}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-purple-50 border border-purple-100 text-purple-900 text-xs space-y-1">
                  <span className="font-bold flex items-center gap-1">
                    <Sparkles size={14} className="text-purple-600" /> Resumo Automático:
                  </span>
                  <p className="text-[11px] leading-relaxed italic">{prof.autoSummary}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de Criação */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-bold text-base text-slate-900">Novo Perfil Inteligente de Cliente</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateProfile} className="space-y-4 text-xs">
                <Input label="Nome do Cliente *" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} required />
                <Input label="Empresa" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
                <Input label="Preferências do Cliente" placeholder="Ex: Prefere atendimento via WhatsApp pela manhã" value={form.preferences} onChange={(e) => setForm({ ...form, preferences: e.target.value })} />
                <Input label="Produtos de Interesse" placeholder="Ex: SaaS CRM IA, WhatsApp API" value={form.interestedItems} onChange={(e) => setForm({ ...form, interestedItems: e.target.value })} />

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                  <Button type="submit" variant="primary" size="sm">Salvar Perfil</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
