'use client';

import React, { useState } from 'react';
import { AgentTemplatesData, AgentTemplate } from '../../data/agentTemplates';
import { Button } from '../Button';
import { Input } from '../Input';
import { X, Search, Layers, CheckCircle2, Sparkles, ArrowRight, Bot } from 'lucide-react';

interface TemplateGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: AgentTemplate) => void;
}

export const TemplateGalleryModal: React.FC<TemplateGalleryModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<AgentTemplate | null>(null);

  if (!isOpen) return null;

  const filteredTemplates = AgentTemplatesData.templates.filter((tpl) => {
    const matchesSearch =
      tpl.name.toLowerCase().includes(search.toLowerCase()) ||
      tpl.objective.toLowerCase().includes(search.toLowerCase()) ||
      tpl.category.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory ? tpl.category === selectedCategory : true;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden border border-slate-200 my-6 flex flex-col h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600 text-white">
              <Layers size={22} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Galeria de 16 Templates Prontos
              </h3>
              <p className="text-xs text-slate-400">
                Selecione um assistente pré-configurado com regras, tom de voz e system prompt otimizados.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={22} />
          </button>
        </div>

        {/* Busca e Filtros */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="w-full sm:w-80">
            <Input
              placeholder="Buscar template por nome ou objetivo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search size={18} />}
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {['', 'Vendas', 'Suporte', 'Financeiro', 'Cobrança', 'RH', 'Marketing', 'Saúde', 'Legal'].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat || 'Todos'}
                </button>
              ),
            )}
          </div>
        </div>

        {/* Grid de Templates */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
          {filteredTemplates.map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => setSelectedTemplate(tpl)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                selectedTemplate?.id === tpl.id
                  ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{tpl.emoji}</span>
                  <span className="text-[10px] font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                    {tpl.category}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900">{tpl.name}</h4>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{tpl.objective}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>{tpl.provider} ({tpl.modelName})</span>
                <span className="text-indigo-600 font-semibold flex items-center gap-1">
                  Usar <ArrowRight size={12} />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Rodapé com Confirmação */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500">
            {selectedTemplate
              ? `Template selecionado: ${selectedTemplate.emoji} ${selectedTemplate.name}`
              : 'Clique em um template para pré-visualizar e selecionar'}
          </span>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={!selectedTemplate}
              rightIcon={<CheckCircle2 size={16} />}
              onClick={() => {
                if (selectedTemplate) {
                  onSelectTemplate(selectedTemplate);
                  onClose();
                }
              }}
            >
              Usar este Template
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
