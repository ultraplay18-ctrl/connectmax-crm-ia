'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';
import { AiStudioHeader } from '../../../../components/ai-studio/AiStudioHeader';
import { KnowledgeHubNavigation } from '../../../../components/ai-studio/KnowledgeHubNavigation';
import { Button } from '../../../../components/Button';
import { Input } from '../../../../components/Input';
import { Globe, Plus, Search, CheckCircle2, RefreshCw } from 'lucide-react';

export default function KnowledgeWebsitesPage() {
  const [urlInput, setUrlInput] = useState('');
  const [pages, setPages] = useState([
    { id: '1', url: 'https://connectmaxcrm.com/sobre', title: 'Sobre o ConnectMax CRM IA', status: 'INDEXED', date: '2026-07-20' },
    { id: '2', url: 'https://connectmaxcrm.com/planos', title: 'Planos e Preços SaaS', status: 'INDEXED', date: '2026-07-22' },
  ]);

  const handleAddWebsite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setPages([
      ...pages,
      {
        id: String(Date.now()),
        url: urlInput.trim(),
        title: `Captura da página: ${urlInput.trim()}`,
        status: 'INDEXED',
        date: new Date().toISOString().split('T')[0],
      },
    ]);
    setUrlInput('');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <AiStudioHeader
          title="Importação de Websites & URLs"
          subtitle="Informe páginas web públicas para captura de conteúdo e resposta de dúvidas."
          activeTab="Base de Conhecimento"
        />

        <KnowledgeHubNavigation />

        <form onSubmit={handleAddWebsite} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Globe className="text-emerald-500" size={18} /> Adicionar Nova URL para Indexação
          </h4>
          <div className="flex gap-3">
            <Input
              placeholder="Ex: https://suaempresa.com.br/faq ou https://suaempresa.com.br/termos"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
            />
            <Button type="submit" variant="primary" leftIcon={<Plus size={18} />}>
              Importar URL
            </Button>
          </div>
        </form>

        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
              <tr>
                <th className="p-4">URL</th>
                <th className="p-4">Título Identificado</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Última Captura</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {pages.map((pg) => (
                <tr key={pg.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-mono font-bold text-brand-600 flex items-center gap-2">
                    <Globe size={16} /> {pg.url}
                  </td>
                  <td className="p-4 text-slate-800 font-semibold">{pg.title}</td>
                  <td className="p-4">
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 size={14} /> Indexado
                    </span>
                  </td>
                  <td className="p-4 text-right text-slate-400 font-mono">{pg.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
