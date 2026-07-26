'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';
import { AiStudioHeader } from '../../../../components/ai-studio/AiStudioHeader';
import { KnowledgeHubNavigation } from '../../../../components/ai-studio/KnowledgeHubNavigation';
import { Button } from '../../../../components/Button';
import { Settings, ShieldCheck, Cpu, CheckCircle2 } from 'lucide-react';

export default function KnowledgeSettingsPage() {
  const [chunkSize, setChunkSize] = useState(512);
  const [chunkOverlap, setChunkOverlap] = useState(64);
  const [defaultRole, setDefaultRole] = useState('EDITOR');
  const [saved, setSaved] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <AiStudioHeader
          title="Configurações & Permissões do Knowledge Hub"
          subtitle="Ajuste o tamanho de fragmentação de documentos (chunks) e permissões de acesso por perfil."
          activeTab="Base de Conhecimento"
        />

        <KnowledgeHubNavigation />

        <form onSubmit={handleSaveSettings} className="space-y-6 max-w-2xl">
          {/* Permissões */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <ShieldCheck className="text-brand-500" size={18} /> Permissões de Acesso às Bibliotecas
            </h4>
            <div className="space-y-2 text-xs">
              <label className="block font-semibold text-slate-700">Nível Padrão de Permissão para Novos Membros</label>
              <select
                value={defaultRole}
                onChange={(e) => setDefaultRole(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 bg-white text-slate-900"
              >
                <option value="ADMIN">Administrador (Acesso total)</option>
                <option value="EDITOR">Editor (Criar, editar e versionar documentos)</option>
                <option value="READER">Leitor (Apenas consulta RAG)</option>
              </select>
            </div>
          </div>

          {/* Parâmetros RAG */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Cpu className="text-purple-500" size={18} /> Parâmetros de Fragmentação Semântica (Chunking)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Tamanho do Chunk (Tokens)</label>
                <input
                  type="number"
                  value={chunkSize}
                  onChange={(e) => setChunkSize(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 p-2.5 font-mono text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Sobreposição / Overlap (Tokens)</label>
                <input
                  type="number"
                  value={chunkOverlap}
                  onChange={(e) => setChunkOverlap(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 p-2.5 font-mono text-slate-900"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" variant="primary" leftIcon={<Settings size={18} />}>
              Salvar Configurações
            </Button>
            {saved && (
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 size={16} /> Configurações salvas!
              </span>
            )}
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
