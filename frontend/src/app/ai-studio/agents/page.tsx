'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { AiStudioHeader } from '../../../components/ai-studio/AiStudioHeader';
import { AiStudioNavigation } from '../../../components/ai-studio/AiStudioNavigation';
import { AgentCard } from '../../../components/ai-studio/AgentCard';
import { AgentWizardModal } from '../../../components/ai-studio/AgentWizardModal';
import { CreationChoiceModal } from '../../../components/ai-studio/CreationChoiceModal';
import { TemplateGalleryModal } from '../../../components/ai-studio/TemplateGalleryModal';
import { PromptBuilderModal } from '../../../components/ai-studio/PromptBuilderModal';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { api } from '../../../services/api';
import { AgentTemplate } from '../../../data/agentTemplates';
import { Bot, Plus, Search, Sparkles, Layers } from 'lucide-react';

export default function AiAgentsPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [modelFilter, setModelFilter] = useState('');

  // Modais de Criação
  const [isChoiceModalOpen, setIsChoiceModalOpen] = useState(false);
  const [isTemplateGalleryOpen, setIsTemplateGalleryOpen] = useState(false);
  const [isPromptBuilderOpen, setIsPromptBuilderOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<any>(null);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      if (categoryFilter) params.append('category', categoryFilter);
      if (modelFilter) params.append('modelName', modelFilter);

      const [agentsRes, usersRes] = await Promise.all([
        api.get(`/ai-studio/agents?${params.toString()}`),
        api.get('/users'),
      ]);
      setAgents(agentsRes.data || []);
      setUsers(usersRes.data || []);
    } catch (err) {
      console.error('Erro ao buscar agentes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAgents();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, statusFilter, categoryFilter, modelFilter]);

  const handleSaveAgent = async (agentData: any) => {
    if (editingAgent) {
      await api.patch(`/ai-studio/agents/${editingAgent.id}`, agentData);
    } else {
      await api.post('/ai-studio/agents', agentData);
    }
    fetchAgents();
  };

  const handleSelectTemplate = async (template: AgentTemplate) => {
    try {
      const payload = {
        name: template.name,
        avatar: template.emoji,
        emoji: template.emoji,
        category: template.category,
        objective: template.objective,
        personality: template.personality,
        toneOfVoice: template.toneOfVoice,
        language: template.language,
        creativity: template.creativity,
        temperature: template.temperature,
        maxTokens: template.maxTokens,
        provider: template.provider,
        modelName: template.modelName,
        systemPrompt: template.systemPrompt,
        initialMessage: template.initialMessage,
        instructions: template.instructions,
        toolsConfig: { tools: template.recommendedTools },
        status: 'ACTIVE',
        isPublished: true,
      };

      await api.post('/ai-studio/agents', payload);
      fetchAgents();
    } catch (err) {
      console.error('Erro ao criar agente a partir do template:', err);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await api.post(`/ai-studio/agents/${id}/duplicate`);
      fetchAgents();
    } catch (err) {
      console.error('Erro ao duplicar agente:', err);
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await api.post(`/ai-studio/agents/${id}/archive`);
      fetchAgents();
    } catch (err) {
      console.error('Erro ao arquivar agente:', err);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await api.patch(`/ai-studio/agents/${id}/toggle-status`);
      fetchAgents();
    } catch (err) {
      console.error('Erro ao alterar status:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este agente de IA?')) return;
    try {
      await api.delete(`/ai-studio/agents/${id}`);
      fetchAgents();
    } catch (err) {
      console.error('Erro ao excluir agente:', err);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <AiStudioHeader
          title="Agentes de Inteligência Artificial"
          subtitle="Crie assistentes virtuais via Prompt Builder Inteligente ou escolha entre 16 Templates Prontos."
          activeTab="Agentes"
          action={
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                leftIcon={<Layers size={18} />}
                onClick={() => setIsTemplateGalleryOpen(true)}
              >
                Templates Prontos (16)
              </Button>
              <Button
                variant="primary"
                leftIcon={<Sparkles size={18} />}
                onClick={() => setIsChoiceModalOpen(true)}
              >
                Criar Novo Agente
              </Button>
            </div>
          }
        />

        <AiStudioNavigation />

        {/* Filtros */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="lg:col-span-2">
              <Input
                placeholder="Buscar por nome, objetivo ou categoria..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search size={18} />}
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="">Todas as Categorias</option>
              <option value="Vendas">Vendas & SDR</option>
              <option value="Suporte">Suporte Técnico</option>
              <option value="Financeiro">Financeiro & Cobrança</option>
              <option value="RH">RH & Onboarding</option>
              <option value="Marketing">Marketing</option>
              <option value="Cobrança">Cobrança</option>
              <option value="Personalizado">Personalizado</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="">Todos os Status</option>
              <option value="ACTIVE">Ativos</option>
              <option value="INACTIVE">Inativos</option>
              <option value="ARCHIVED">Arquivados</option>
            </select>
          </div>
        </div>

        {/* Grid de Cards de Agentes */}
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs">Carregando agentes de IA...</div>
        ) : agents.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-4 max-w-lg mx-auto my-8">
            <div className="p-4 rounded-full bg-brand-50 text-brand-600 w-16 h-16 mx-auto flex items-center justify-center">
              <Bot size={36} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Nenhum Agente Encontrado</h3>
              <p className="text-xs text-slate-500 mt-1">
                Utilize o Prompt Builder Inteligente ou selecione um dos 16 Templates Prontos.
              </p>
            </div>
            <div className="flex justify-center gap-3">
              <Button variant="outline" leftIcon={<Layers size={16} />} onClick={() => setIsTemplateGalleryOpen(true)}>
                Ver 16 Templates
              </Button>
              <Button variant="primary" leftIcon={<Sparkles size={16} />} onClick={() => setIsChoiceModalOpen(true)}>
                Criar Agente
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onEdit={(a) => {
                  setEditingAgent(a);
                  setIsWizardOpen(true);
                }}
                onDuplicate={handleDuplicate}
                onArchive={handleArchive}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Modal 1: Escolha Inicial (Criar do Zero vs Template) */}
        <CreationChoiceModal
          isOpen={isChoiceModalOpen}
          onClose={() => setIsChoiceModalOpen(false)}
          onSelectBuilder={() => setIsPromptBuilderOpen(true)}
          onSelectTemplate={() => setIsTemplateGalleryOpen(true)}
        />

        {/* Modal 2: Galeria de 16 Templates Prontos */}
        <TemplateGalleryModal
          isOpen={isTemplateGalleryOpen}
          onClose={() => setIsTemplateGalleryOpen(false)}
          onSelectTemplate={handleSelectTemplate}
        />

        {/* Modal 3: Prompt Builder Inteligente em 8 Passos */}
        <PromptBuilderModal
          isOpen={isPromptBuilderOpen}
          onClose={() => setIsPromptBuilderOpen(false)}
          onSubmit={handleSaveAgent}
        />

        {/* Modal 4: Wizard Padrão para Edição */}
        <AgentWizardModal
          isOpen={isWizardOpen}
          onClose={() => setIsWizardOpen(false)}
          onSubmit={handleSaveAgent}
          initialData={editingAgent}
        />
      </div>
    </DashboardLayout>
  );
}
