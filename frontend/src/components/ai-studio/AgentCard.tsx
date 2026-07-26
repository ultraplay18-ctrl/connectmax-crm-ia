'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from '../Badge';
import { Button } from '../Button';
import {
  Bot,
  Cpu,
  Copy,
  Edit,
  Trash2,
  Power,
  Archive,
  User,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface AgentCardProps {
  agent: {
    id: string;
    name: string;
    avatar?: string;
    emoji?: string;
    description?: string;
    category: string;
    modelName: string;
    provider: string;
    status: string;
    version?: number;
    temperature: number;
    responsible?: { id: string; name: string; email: string };
    executions?: any[];
  };
  onEdit: (agent: any) => void;
  onDuplicate: (id: string) => void;
  onArchive: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

export const AgentCard: React.FC<AgentCardProps> = ({
  agent,
  onEdit,
  onDuplicate,
  onArchive,
  onToggleStatus,
  onDelete,
}) => {
  const isInactive = agent.status === 'INACTIVE';
  const isArchived = agent.status === 'ARCHIVED';
  const lastExec = agent.executions?.[0];

  const getProviderColor = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'openai':
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20';
      case 'anthropic':
        return 'bg-amber-500/10 text-amber-700 border-amber-500/20';
      case 'google':
        return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
      case 'deepseek':
        return 'bg-indigo-500/10 text-indigo-700 border-indigo-500/20';
      case 'xai':
        return 'bg-purple-500/10 text-purple-700 border-purple-500/20';
      case 'ollama':
        return 'bg-slate-800 text-white border-slate-700';
      default:
        return 'bg-brand-500/10 text-brand-700 border-brand-500/20';
    }
  };

  return (
    <div
      className={`bg-white rounded-3xl border transition-all duration-200 p-5 flex flex-col justify-between space-y-4 group ${
        isArchived
          ? 'border-slate-200 opacity-60 bg-slate-100/50'
          : isInactive
          ? 'border-slate-200/80 bg-slate-50/50'
          : 'border-slate-200/80 hover:border-brand-500/50 hover:shadow-xl hover:shadow-brand-500/5'
      }`}
    >
      <div className="space-y-3">
        {/* Header do Card com Emoji/Avatar */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="text-2xl p-2.5 rounded-2xl bg-slate-100 border border-slate-200/80 flex items-center justify-center shrink-0 shadow-sm">
              {agent.avatar || agent.emoji || '🤖'}
            </div>
            <div>
              <Link href={`/ai-studio/agents/${agent.id}`}>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors leading-tight hover:underline">
                  {agent.name}
                </h3>
              </Link>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] font-medium text-slate-500">{agent.category}</span>
                <span className="text-[10px] font-mono text-brand-600 bg-brand-50 px-1.5 py-0.2 rounded font-bold">
                  v{agent.version || 1}
                </span>
              </div>
            </div>
          </div>

          <Badge variant={agent.status === 'ACTIVE' ? 'green' : agent.status === 'ARCHIVED' ? 'slate' : 'slate'}>
            {agent.status === 'ACTIVE' ? 'Ativo' : agent.status === 'ARCHIVED' ? 'Arquivado' : 'Inativo'}
          </Badge>
        </div>

        {/* Descrição */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed min-h-[2.5rem]">
          {agent.description || 'Nenhuma descrição fornecida para este agente.'}
        </p>

        {/* Informações de Responsável e Última Execução */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              <User size={12} className="text-slate-400" /> Responsável:
            </span>
            <strong className="text-slate-800">{agent.responsible?.name || 'Administrador'}</strong>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Clock size={12} className="text-slate-400" /> Última execução:
            </span>
            <span className="font-mono text-slate-700">
              {lastExec ? new Date(lastExec.createdAt).toLocaleDateString('pt-BR') : 'Nunca executado'}
            </span>
          </div>
        </div>

        {/* Tags de Modelo & Provedor */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getProviderColor(agent.provider)}`}>
            {agent.provider}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
            <Cpu size={12} /> {agent.modelName}
          </span>
        </div>
      </div>

      {/* Rodapé e Ações */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onToggleStatus(agent.id)}
            title={agent.status === 'ACTIVE' ? 'Desativar Agente' : 'Ativar Agente'}
            className={`p-2 rounded-lg transition-colors text-xs font-semibold flex items-center gap-1 ${
              agent.status === 'ACTIVE' ? 'text-emerald-600 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-100'
            }`}
          >
            <Power size={14} />
          </button>

          <button
            onClick={() => onDuplicate(agent.id)}
            title="Duplicar Agente"
            className="p-2 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-brand-50 transition-colors"
          >
            <Copy size={14} />
          </button>

          <button
            onClick={() => onArchive(agent.id)}
            title="Arquivar Agente"
            className="p-2 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
          >
            <Archive size={14} />
          </button>

          <button
            onClick={() => onDelete(agent.id)}
            title="Excluir Agente"
            className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>

        <Link href={`/ai-studio/agents/${agent.id}`}>
          <Button variant="outline" size="sm" rightIcon={<ArrowRight size={14} />}>
            Gerenciar
          </Button>
        </Link>
      </div>
    </div>
  );
};
