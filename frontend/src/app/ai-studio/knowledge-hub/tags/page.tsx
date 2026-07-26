'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';
import { AiStudioHeader } from '../../../../components/ai-studio/AiStudioHeader';
import { KnowledgeHubNavigation } from '../../../../components/ai-studio/KnowledgeHubNavigation';
import { Button } from '../../../../components/Button';
import { Input } from '../../../../components/Input';
import { Tag, Plus } from 'lucide-react';

export default function KnowledgeTagsPage() {
  const [tags, setTags] = useState([
    { id: '1', name: 'v3.0-saas', color: 'bg-blue-500' },
    { id: '2', name: 'urgente', color: 'bg-red-500' },
    { id: '3', name: 'lgpd-compliance', color: 'bg-emerald-500' },
    { id: '4', name: 'api-mcp', color: 'bg-purple-500' },
  ]);
  const [tagName, setTagName] = useState('');

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagName.trim()) return;

    setTags([
      ...tags,
      { id: String(Date.now()), name: tagName.trim(), color: 'bg-brand-500' },
    ]);
    setTagName('');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <AiStudioHeader
          title="Marcação por Tags"
          subtitle="Crie tags transversais para rotular documentos e FAQs."
          activeTab="Base de Conhecimento"
        />

        <KnowledgeHubNavigation />

        <form onSubmit={handleAddTag} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-end gap-3">
          <div className="flex-1">
            <Input
              label="Nome da Tag *"
              placeholder="Ex: onboarding-2026"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
            />
          </div>
          <Button type="submit" variant="primary" leftIcon={<Plus size={18} />}>
            Criar Tag
          </Button>
        </form>

        <div className="flex flex-wrap gap-3 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          {tags.map((tg) => (
            <span
              key={tg.id}
              className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold text-white bg-slate-900 flex items-center gap-1.5 shadow-sm"
            >
              <Tag size={14} className="text-brand-400" /> #{tg.name}
            </span>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
