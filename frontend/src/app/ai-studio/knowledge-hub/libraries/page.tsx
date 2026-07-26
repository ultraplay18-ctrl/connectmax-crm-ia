'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';
import { AiStudioHeader } from '../../../../components/ai-studio/AiStudioHeader';
import { KnowledgeHubNavigation } from '../../../../components/ai-studio/KnowledgeHubNavigation';
import { Button } from '../../../../components/Button';
import { Input } from '../../../../components/Input';
import { api } from '../../../../services/api';
import { FolderKanban, Plus, Search, FileText, HelpCircle, Trash2, X, AlertCircle } from 'lucide-react';

export default function KnowledgeLibrariesPage() {
  const [libraries, setLibraries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Formulário de Nova Biblioteca
  const [formData, setFormData] = useState({
    name: '',
    category: 'Produtos',
    description: '',
    icon: '📚',
    color: '#2563EB',
    accessLevel: 'EDITOR',
  });

  useEffect(() => {
    fetchLibraries();
  }, []);

  const fetchLibraries = async () => {
    try {
      const res = await api.get('/ai-studio/knowledge-hub/libraries');
      setLibraries(res.data || []);
    } catch (err) {
      console.error('Erro ao buscar bibliotecas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLibrary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      await api.post('/ai-studio/knowledge-hub/libraries', formData);
      setIsModalOpen(false);
      setFormData({ name: '', category: 'Produtos', description: '', icon: '📚', color: '#2563EB', accessLevel: 'EDITOR' });
      fetchLibraries();
    } catch (err) {
      console.error('Erro ao criar biblioteca:', err);
    }
  };

  const handleDeleteLibrary = async (id: string) => {
    if (!window.confirm('Excluir esta biblioteca de conhecimento?')) return;
    try {
      await api.delete(`/ai-studio/knowledge-hub/libraries/${id}`);
      fetchLibraries();
    } catch (err) {
      console.error('Erro ao excluir biblioteca:', err);
    }
  };

  const filteredLibraries = libraries.filter((lib) =>
    lib.name.toLowerCase().includes(search.toLowerCase()) || lib.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <AiStudioHeader
          title="Bibliotecas de Conhecimento"
          subtitle="Organize os conhecimentos da sua empresa por categorias (Produtos, Financeiro, RH, Jurídico, Comercial)."
          activeTab="Base de Conhecimento"
          action={
            <Button variant="primary" leftIcon={<Plus size={18} />} onClick={() => setIsModalOpen(true)}>
              Nova Biblioteca
            </Button>
          }
        />

        <KnowledgeHubNavigation />

        {/* Busca */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <Input
            placeholder="Buscar bibliotecas por nome ou categoria..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search size={18} />}
          />
        </div>

        {/* Grid de Bibliotecas */}
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs">Carregando bibliotecas...</div>
        ) : filteredLibraries.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-3 max-w-md mx-auto my-8">
            <FolderKanban size={36} className="mx-auto text-slate-400" />
            <h3 className="text-sm font-bold text-slate-900">Nenhuma Biblioteca Cadastrada</h3>
            <p className="text-xs text-slate-500">Crie sua primeira biblioteca para organizar os documentos corporativos.</p>
            <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
              Criar Biblioteca
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLibraries.map((lib) => (
              <div key={lib.id} className="bg-white rounded-3xl border border-slate-200/80 p-5 space-y-4 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 rounded-2xl bg-slate-100 border border-slate-200">{lib.icon || '📚'}</span>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">{lib.name}</h4>
                      <span className="text-[11px] font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">{lib.category}</span>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteLibrary(lib.id)} className="text-slate-400 hover:text-red-600 p-1">
                    <Trash2 size={16} />
                  </button>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2">{lib.description || 'Sem descrição.'}</p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
                  <span className="flex items-center gap-1"><FileText size={14} /> {lib.documents?.length || 0} Documentos</span>
                  <span className="flex items-center gap-1"><HelpCircle size={14} /> {lib.faqs?.length || 0} FAQs</span>
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
                <h3 className="font-bold text-base text-slate-900">Nova Biblioteca de Conhecimento</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateLibrary} className="space-y-4 text-xs">
                <Input label="Nome da Biblioteca *" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">Categoria</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2.5 bg-white text-slate-900"
                  >
                    <option value="Produtos">Produtos</option>
                    <option value="Financeiro">Financeiro</option>
                    <option value="RH">RH</option>
                    <option value="Jurídico">Jurídico</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Comercial">Comercial</option>
                    <option value="Personalizado">Personalizado</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">Descrição</label>
                  <textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900" />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                  <Button type="submit" variant="primary" size="sm">Criar Biblioteca</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
