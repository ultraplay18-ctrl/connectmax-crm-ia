'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { AiStudioHeader } from '../../../components/ai-studio/AiStudioHeader';
import { AiStudioNavigation } from '../../../components/ai-studio/AiStudioNavigation';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { Settings, ShieldCheck, Key, Lock, CheckCircle2, Sliders, ToggleLeft } from 'lucide-react';

export default function AiSettingsPage() {
  const [saved, setSaved] = useState(false);

  const [featureFlags, setFeatureFlags] = useState({
    enable_ai_studio: true,
    enable_mcp: true,
    enable_custom_models: true,
    enable_workflows: true,
    enable_knowledge_base: true,
  });

  const [apiKeys, setApiKeys] = useState({
    openai_key: 'sk-proj-********************************',
    anthropic_key: 'sk-ant-********************************',
    gemini_key: 'AIzaSy********************************',
    deepseek_key: 'sk-ds-********************************',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <AiStudioHeader
          title="Configurações Globais do AI Studio e Feature Flags"
          subtitle="Gerencie Feature Flags por empresa e credenciais de provedores de IA."
          activeTab="Configurações"
        />

        <AiStudioNavigation />

        <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
          {saved && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 size={18} /> Configurações salvas com sucesso!
            </div>
          )}

          {/* Feature Flags por Empresa */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="text-brand-500" size={18} /> Feature Flags por Empresa (Tenant Control)
            </h3>
            <p className="text-xs text-slate-500">
              Ative ou desative recursos específicos do AI Studio para a empresa.
            </p>

            <div className="divide-y divide-slate-100">
              {[
                { key: 'enable_ai_studio', label: 'Habilitar Módulo AI Studio', desc: 'Permite acesso ao painel de criação e gestão de agentes.' },
                { key: 'enable_mcp', label: 'Habilitar Arquitetura MCP (Model Context Protocol)', desc: 'Permite conectar servidores de dados externos via protocolo MCP.' },
                { key: 'enable_custom_models', label: 'Permitir Modelos Personalizados & Ollama', desc: 'Habilita seleção de modelos locais Ollama e OpenRouter.' },
                { key: 'enable_workflows', label: 'Habilitar Workflows & Ações Encadeadas', desc: 'Permite encadeamento visual de passos multi-agente.' },
                { key: 'enable_knowledge_base', label: 'Habilitar Base de Conhecimento (RAG)', desc: 'Permite upload de arquivos PDF, DOCX e sites para contexto.' },
              ].map((flag) => (
                <div key={flag.key} className="py-3 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{flag.label}</h4>
                    <p className="text-[11px] text-slate-500">{flag.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={(featureFlags as any)[flag.key]}
                    onChange={(e) =>
                      setFeatureFlags({ ...featureFlags, [flag.key]: e.target.checked })
                    }
                    className="h-5 w-5 rounded border-slate-300 text-brand-500 focus:ring-brand-500 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Credenciais e Chaves de API */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Key className="text-amber-500" size={18} /> Chaves de API de Provedores (Criptografadas AES-256)
            </h3>
            <p className="text-xs text-slate-500">
              Caso deseje utilizar suas próprias chaves de API (Bring Your Own Key - BYOK).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Chave API OpenAI"
                type="password"
                value={apiKeys.openai_key}
                onChange={(e) => setApiKeys({ ...apiKeys, openai_key: e.target.value })}
                leftIcon={<Lock size={16} />}
              />
              <Input
                label="Chave API Anthropic (Claude)"
                type="password"
                value={apiKeys.anthropic_key}
                onChange={(e) => setApiKeys({ ...apiKeys, anthropic_key: e.target.value })}
                leftIcon={<Lock size={16} />}
              />
              <Input
                label="Chave API Google Gemini"
                type="password"
                value={apiKeys.gemini_key}
                onChange={(e) => setApiKeys({ ...apiKeys, gemini_key: e.target.value })}
                leftIcon={<Lock size={16} />}
              />
              <Input
                label="Chave API DeepSeek"
                type="password"
                value={apiKeys.deepseek_key}
                onChange={(e) => setApiKeys({ ...apiKeys, deepseek_key: e.target.value })}
                leftIcon={<Lock size={16} />}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" variant="primary" rightIcon={<CheckCircle2 size={16} />}>
              Salvar Configurações
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
