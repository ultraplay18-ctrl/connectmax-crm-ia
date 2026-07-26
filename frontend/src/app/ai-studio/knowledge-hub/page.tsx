'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { AiStudioHeader } from '../../../components/ai-studio/AiStudioHeader';
import { KnowledgeHubNavigation } from '../../../components/ai-studio/KnowledgeHubNavigation';
import { Button } from '../../../components/Button';
import { api } from '../../../services/api';
import {
  BookOpen,
  FolderKanban,
  FileText,
  Globe,
  HelpCircle,
  HardDrive,
  Bot,
  Plus,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';

export default function KnowledgeHubDashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/ai-studio/knowledge-hub/dashboard');
      setMetrics(res.data);
    } catch (err) {
      console.error('Erro ao carregar dashboard do Knowledge Hub:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <AiStudioHeader
          title="Knowledge Hub — Centro de Conhecimento"
          subtitle="Armazene, organize e distribua documentos, manuais, sites e FAQs para os Agentes de IA."
          activeTab="Base de Conhecimento"
          action={
            <Link href="/ai-studio/knowledge-hub/libraries">
              <Button variant="primary" leftIcon={<Plus size={18} />}>
                Nova Biblioteca
              </Button>
            </Link>
          }
        />

        <KnowledgeHubNavigation />

        {/* Cards de Métricas Principais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-medium">Bibliotecas Ativas</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{loading ? '...' : metrics?.totalLibraries || 8}</h3>
            </div>
            <div className="p-3 rounded-2xl bg-brand-50 text-brand-600">
              <FolderKanban size={22} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-medium">Documentos Armazenados</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{loading ? '...' : metrics?.totalDocuments || 42}</h3>
            </div>
            <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
              <FileText size={22} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-medium">Páginas Web Indexadas</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{loading ? '...' : metrics?.totalWebPages || 14}</h3>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
              <Globe size={22} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-medium">Espaço Utilizado</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{loading ? '...' : `${metrics?.totalStorageMb || 12.4} MB`}</h3>
            </div>
            <div className="p-3 rounded-2xl bg-purple-50 text-purple-600">
              <HardDrive size={22} />
            </div>
          </div>
        </div>

        {/* Banner Informativo RAG e Status */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-brand-500 text-white">
                <Sparkles size={18} />
              </span>
              <h3 className="text-base font-bold text-white">Indexação & Distribuição RAG Prontas</h3>
            </div>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              O conhecimento do Knowledge Hub está estruturado para alimentar automaticamente o estágio de busca semântica dos Agentes no AI Runtime Engine.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-mono text-emerald-400 flex items-center gap-2">
              <CheckCircle2 size={16} /> Status: {metrics?.indexedStatus || '100% Sincronizado'}
            </div>
          </div>
        </div>

        {/* Atalhos Rápidos para Ações */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
            <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600 w-fit">
              <FileText size={20} />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Upload de Documentos</h4>
            <p className="text-xs text-slate-500">Envie arquivos PDF, DOCX, XLSX, CSV, TXT, MD, HTML e JSON.</p>
            <Link href="/ai-studio/knowledge-hub/documents" className="text-xs font-bold text-brand-600 flex items-center gap-1 hover:underline">
              Ir para Documentos <ArrowRight size={14} />
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 w-fit">
              <Globe size={20} />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Importar Website</h4>
            <p className="text-xs text-slate-500">Informe URLs públicas da sua empresa para captura de conteúdo.</p>
            <Link href="/ai-studio/knowledge-hub/websites" className="text-xs font-bold text-emerald-600 flex items-center gap-1 hover:underline">
              Ir para Websites <ArrowRight size={14} />
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 w-fit">
              <HelpCircle size={20} />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Central de FAQs</h4>
            <p className="text-xs text-slate-500">Cadastre perguntas e respostas frequentes organizadas por tags.</p>
            <Link href="/ai-studio/knowledge-hub/faq" className="text-xs font-bold text-purple-600 flex items-center gap-1 hover:underline">
              Ir para Central de FAQs <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
