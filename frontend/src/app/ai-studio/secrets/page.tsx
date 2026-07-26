'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { AiStudioHeader } from '../../../components/ai-studio/AiStudioHeader';
import { ProvidersNavigation } from '../../../components/ai-studio/ProvidersNavigation';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { api } from '../../../services/api';
import { Key, ShieldCheck, Lock, Plus, Trash2, Eye, EyeOff, X, CheckCircle2 } from 'lucide-react';

export default function SecretsManagerPage() {
  const [secrets, setSecrets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    keyName: 'OPENAI_API_KEY',
    value: '',
    category: 'PROVIDER',
  });

  const availableKeys = [
    { key: 'OPENAI_API_KEY', label: 'OpenAI API Key' },
    { key: 'CLAUDE_API_KEY', label: 'Anthropic Claude API Key' },
    { key: 'GEMINI_API_KEY', label: 'Google Gemini API Key' },
    { key: 'DEEPSEEK_API_KEY', label: 'DeepSeek API Key' },
    { key: 'OPENROUTER_API_KEY', label: 'OpenRouter API Key' },
    { key: 'GROK_API_KEY', label: 'xAI Grok API Key' },
    { key: 'OLLAMA_SERVER', label: 'Ollama Server Endpoint (Local)' },
    { key: 'MCP_TOKENS', label: 'MCP Connectors Token' },
    { key: 'WEBHOOK_TOKENS', label: 'Webhook Security Token' },
    { key: 'API_TOKENS', label: 'Internal REST API Token' },
  ];

  useEffect(() => {
    fetchSecrets();
  }, []);

  const fetchSecrets = async () => {
    try {
      const res = await api.get('/ai-studio/secrets');
      setSecrets(res.data || []);
    } catch (err) {
      console.error('Erro ao buscar credenciais do cofre:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSecret = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.value.trim()) return;

    try {
      await api.post('/ai-studio/secrets', form);
      setIsModalOpen(false);
      setForm({ keyName: 'OPENAI_API_KEY', value: '', category: 'PROVIDER' });
      fetchSecrets();
    } catch (err) {
      console.error('Erro ao salvar credencial:', err);
    }
  };

  const handleDeleteSecret = async (keyName: string) => {
    if (!window.confirm(`Remover a credencial ${keyName} do cofre?`)) return;

    try {
      await api.delete(`/ai-studio/secrets/${keyName}`);
      fetchSecrets();
    } catch (err) {
      console.error('Erro ao excluir credencial:', err);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <AiStudioHeader
          title="Cofre de Credenciais (Secrets Manager)"
          subtitle="Armazenamento criptografado AES-256 isolado por empresa com mascaramento automático de API Keys."
          activeTab="Provedores"
          action={
            <Button variant="primary" leftIcon={<Plus size={18} />} onClick={() => setIsModalOpen(true)}>
              Adicionar Credencial
            </Button>
          }
        />

        <ProvidersNavigation />

        {/* Banner de Segurança Criptográfica */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-500 text-white">
                <Lock size={18} />
              </span>
              <h3 className="text-base font-bold text-white">Criptografia Forte AES-256-GCM Ativa</h3>
            </div>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Suas chaves de API são salvas em formato cifrado no banco de dados e nunca são expostas pela API em texto claro.
            </p>
          </div>

          <div className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-emerald-400 flex items-center gap-2">
            <ShieldCheck size={16} /> Multi-Tenant Secured
          </div>
        </div>

        {/* Lista de Credenciais */}
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs">Carregando cofre de credenciais...</div>
        ) : secrets.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-3 max-w-md mx-auto my-8">
            <Key size={36} className="mx-auto text-slate-400" />
            <h3 className="text-sm font-bold text-slate-900">Cofre de Credenciais Vazio</h3>
            <p className="text-xs text-slate-500">Cadastre suas API Keys (OpenAI, Claude, Gemini, DeepSeek, etc.).</p>
            <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
              Cadastrar Primeira API Key
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                <tr>
                  <th className="p-4">Nome da Credencial</th>
                  <th className="p-4">Valor Mascarado</th>
                  <th className="p-4">Categoria</th>
                  <th className="p-4 text-right">Última Atualização</th>
                  <th className="p-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {secrets.map((sec) => (
                  <tr key={sec.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-900 flex items-center gap-2">
                      <Key size={16} className="text-emerald-600" /> {sec.keyName}
                    </td>
                    <td className="p-4 font-mono font-bold text-indigo-600">
                      <span className="bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
                        {sec.maskedValue}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-slate-600">
                      <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">
                        {sec.category}
                      </span>
                    </td>
                    <td className="p-4 text-right text-slate-400 font-mono">
                      {new Date(sec.updatedAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteSecret(sec.keyName)}
                        className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal de Cadastro */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-bold text-base text-slate-900">Salvar Credencial no Cofre Seguro</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveSecret} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">Identificador / Nome da Chave *</label>
                  <select
                    value={form.keyName}
                    onChange={(e) => setForm({ ...form, keyName: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2.5 bg-white text-slate-900 font-mono"
                  >
                    {availableKeys.map((k) => (
                      <option key={k.key} value={k.key}>
                        {k.key} — ({k.label})
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Valor Real da API Key / Token *"
                  type="password"
                  placeholder="Cole aqui o token (Ex: sk-proj-...)"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                  required
                />

                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                  🔒 O valor digitado será imediatamente criptografado com a algoritmo AES-256-GCM. Apenas o formato mascarado será visível no painel.
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" variant="primary" size="sm">
                    Criptografar e Salvar
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
