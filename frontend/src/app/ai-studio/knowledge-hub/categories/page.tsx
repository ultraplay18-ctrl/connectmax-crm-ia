'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';
import { AiStudioHeader } from '../../../../components/ai-studio/AiStudioHeader';
import { KnowledgeHubNavigation } from '../../../../components/ai-studio/KnowledgeHubNavigation';
import { Button } from '../../../../components/Button';
import { Input } from '../../../../components/Input';
import { FolderTree, Plus, Trash2 } from 'lucide-react';

export default function KnowledgeCategoriesPage() {
  const [categories, setCategories] = useState([
    { id: '1', name: 'Produtos SaaS', slug: 'produtos-saas', count: 14 },
    { id: '2', name: 'Financeiro & Faturas', slug: 'financeiro-faturas', count: 8 },
    { id: '3', name: 'RH & Benefícios', slug: 'rh-beneficios', count: 6 },
    { id: '4', name: 'Políticas Jurídicas', slug: 'politicas-juridicas', count: 5 },
  ]);
  const [newCatName, setNewCatName] = useState('');

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    setCategories([
      ...categories,
      {
        id: String(Date.now()),
        name: newCatName.trim(),
        slug: newCatName.toLowerCase().replace(/\s+/g, '-'),
        count: 0,
      },
    ]);
    setNewCatName('');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <AiStudioHeader
          title="Taxonomia & Categorias"
          subtitle="Gerencie as categorias estruturadas do conhecimento da empresa."
          activeTab="Base de Conhecimento"
        />

        <KnowledgeHubNavigation />

        <form onSubmit={handleAddCategory} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-end gap-3">
          <div className="flex-1">
            <Input
              label="Nova Categoria *"
              placeholder="Ex: Integrações REST & Webhooks"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
            />
          </div>
          <Button type="submit" variant="primary" leftIcon={<Plus size={18} />}>
            Adicionar Categoria
          </Button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600">
                  <FolderTree size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">{cat.name}</h4>
                  <span className="text-[10px] font-mono text-slate-400">slug: {cat.slug}</span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold bg-slate-100 px-2.5 py-1 rounded text-slate-700">
                {cat.count} itens
              </span>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
