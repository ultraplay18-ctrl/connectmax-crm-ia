'use client';

import React from 'react';
import { X, Sparkles, Layers, ArrowRight, Bot, Cpu } from 'lucide-react';

interface CreationChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBuilder: () => void;
  onSelectTemplate: () => void;
}

export const CreationChoiceModal: React.FC<CreationChoiceModalProps> = ({
  isOpen,
  onClose,
  onSelectBuilder,
  onSelectTemplate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-200 p-6 space-y-6 my-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 text-white shadow-md">
              <Sparkles size={22} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Como você deseja criar seu Agente?</h3>
              <p className="text-xs text-slate-500">Escolha o método mais rápido para seu objetivo.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Escolhas Visuais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Opção 1: Prompt Builder Inteligente */}
          <button
            onClick={() => {
              onClose();
              onSelectBuilder();
            }}
            className="p-5 rounded-2xl border-2 border-slate-200 bg-white hover:border-brand-500 hover:bg-brand-50/50 transition-all text-left flex flex-col justify-between space-y-4 group shadow-sm hover:shadow-lg"
          >
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-brand-50 text-brand-600 w-fit group-hover:bg-brand-500 group-hover:text-white transition-colors">
                <Sparkles size={24} />
              </div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-brand-600">
                Prompt Builder Inteligente
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Responda a um formulário guiado em 8 passos e deixe o sistema gerar prompts de nível enterprise automaticamente.
              </p>
            </div>

            <span className="text-xs font-bold text-brand-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Iniciar Gerador Guiado <ArrowRight size={14} />
            </span>
          </button>

          {/* Opção 2: Utilizar Template Pronto */}
          <button
            onClick={() => {
              onClose();
              onSelectTemplate();
            }}
            className="p-5 rounded-2xl border-2 border-slate-200 bg-white hover:border-indigo-500 hover:bg-indigo-50/50 transition-all text-left flex flex-col justify-between space-y-4 group shadow-sm hover:shadow-lg"
          >
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 w-fit group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Layers size={24} />
              </div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600">
                Galeria de 16 Templates Prontos
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Escolha modelos pré-configurados para SDR, Atendimento, Suporte, Cobrança, RH, Clínica e mais.
              </p>
            </div>

            <span className="text-xs font-bold text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Explorar Templates <ArrowRight size={14} />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
