'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { AiStudioHeader } from '../../../components/ai-studio/AiStudioHeader';
import { AiStudioNavigation } from '../../../components/ai-studio/AiStudioNavigation';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { Badge } from '../../../components/Badge';
import { api } from '../../../services/api';
import {
  Wrench,
  Layers,
  CheckCircle2,
  Plus,
  Globe,
  Database,
  Calendar,
  MessageCircle,
  Mail,
  DollarSign,
  Briefcase,
  X,
  AlertCircle,
  Radio,
} from 'lucide-react';

export default function AiToolsPage() {
  const [nativeTools, setNativeTools] = useState<any[]>([]);
  const [connectors, setConnectors] = useState<any[]>([]);
  const [mcpServers, setMcpServers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal Novo Servidor MCP
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');
  const [serverName, setServerName] = useState('');
  const [serverSlug, setServerSlug] = useState('github');
  const [serverType, setServerType] = useState<'STDIO' | 'SSE' | 'HTTP'>('STDIO');
  const [urlOrCmd, setUrlOrCmd] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [toolsRes, connectorsRes, serversRes] = await Promise.all([
        api.get('/ai-studio/tools'),
        api.get('/ai-studio/mcp/connectors'),
        api.get('/ai-studio/mcp/servers'),
      ]);
      setNativeTools(toolsRes.data || []);
      setConnectors(connectorsRes.data || []);
      setMcpServers(serversRes.data || []);
    } catch (err) {
      console.error('Erro ao buscar ferramentas e MCP:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateMcpServer = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');

    if (!serverName.trim()) {
      setModalError('O nome do servidor MCP é obrigatório.');
      return;
    }

    setModalLoading(true);
    try {
      await api.post('/ai-studio/mcp/servers', {
        name: serverName,
        slug: serverSlug,
        type: serverType,
        urlOrCmd,
      });

      setIsModalOpen(false);
      setServerName('');
      setUrlOrCmd('');
      fetchData();
    } catch (err: any) {
      setModalError(err.response?.data?.message || 'Erro ao conectar servidor MCP.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteMcpServer = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja remover este servidor MCP?')) return;
    try {
      await api.delete(`/ai-studio/mcp/servers/${id}`);
      fetchData();
    } catch (err) {
      console.error('Erro ao excluir servidor MCP:', err);
    }
  };

  const getToolIcon = (slug: string) => {
    switch (slug) {
      case 'crm':
        return <Briefcase className="text-brand-500" size={20} />;
      case 'financial':
        return <DollarSign className="text-emerald-500" size={20} />;
      case 'calendar':
        return <Calendar className="text-indigo-500" size={20} />;
      case 'whatsapp':
        return <MessageCircle className="text-green-500" size={20} />;
      case 'email':
        return <Mail className="text-amber-500" size={20} />;
      case 'database':
        return <Database className="text-purple-500" size={20} />;
      default:
        return <Wrench className="text-brand-500" size={20} />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <AiStudioHeader
          title="Ferramentas Nativas e Arquitetura MCP"
          subtitle="Capacidades funcionais e conectores de protocolo Model Context Protocol."
          activeTab="Ferramentas & MCP"
          action={
            <Button variant="primary" leftIcon={<Plus size={18} />} onClick={() => setIsModalOpen(true)}>
              Conectar Servidor MCP
            </Button>
          }
        />

        <AiStudioNavigation />

        {/* Seção 1: Ferramentas Nativas do Agente */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Wrench size={20} className="text-brand-500" /> Ferramentas Nativas Habilitadas (Native Capabilities)
          </h2>

          {loading ? (
            <div className="py-12 text-center text-slate-400 text-xs">Carregando ferramentas...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {nativeTools.map((tool) => (
                <div
                  key={tool.slug}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-xl bg-slate-100">{getToolIcon(tool.slug)}</div>
                      <Badge variant="green">Ativa</Badge>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">{tool.name}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{tool.description}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>Categoria: {tool.category}</span>
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 size={12} /> Habilitada
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Seção 2: Servidores MCP (Model Context Protocol) */}
        <div className="space-y-4 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Layers size={20} className="text-indigo-600" /> Servidores MCP Conectados (Model Context Protocol)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Protocolo padronizado para expor dados de sistemas externos aos Agentes de IA sem acoplamento.
              </p>
            </div>

            <Button variant="outline" size="sm" leftIcon={<Plus size={16} />} onClick={() => setIsModalOpen(true)}>
              Adicionar Conector MCP
            </Button>
          </div>

          {/* Banner MCP */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-indigo-900 space-y-3">
            <div className="flex items-center gap-2">
              <Radio className="text-indigo-400 animate-pulse" size={18} />
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                Arquitetura MCP Ativa (STDIO / SSE / HTTP)
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              O Model Context Protocol (MCP) conecta com segurança seus agentes a servidores de dados como <strong>GitHub, Google Drive, Notion, Slack, Discord, PostgreSQL, MySQL e APIs REST</strong>.
            </p>
          </div>

          {/* Grid de Servidores MCP Conectados */}
          {mcpServers.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center text-xs text-slate-500 space-y-2">
              <p className="font-semibold text-slate-700">Nenhum servidor MCP configurado ainda.</p>
              <p>Conecte o seu primeiro servidor MCP para expor ferramentas e recursos externos aos Agentes.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mcpServers.map((server) => (
                <div key={server.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Globe size={18} className="text-indigo-600" /> {server.name}
                      </h3>
                      <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-500 mt-1 inline-block">
                        Tipo: {server.type}
                      </span>
                    </div>

                    <Badge variant="blue">{server.status}</Badge>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                    <span className="font-semibold text-slate-600 block">Ferramentas Expostas ({server.tools?.length || 0})</span>
                    {server.tools?.map((tool: any) => (
                      <div key={tool.id} className="p-2 rounded bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-700 flex items-center justify-between">
                        <span>{tool.name}</span>
                        <CheckCircle2 size={12} className="text-emerald-500" />
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                    <button
                      onClick={() => handleDeleteMcpServer(server.id)}
                      className="text-xs text-red-600 font-semibold hover:underline"
                    >
                      Remover Servidor
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Conectar MCP */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="text-indigo-600" /> Conectar Servidor MCP
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>

              {modalError && (
                <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle size={16} /> {modalError}
                </div>
              )}

              <form onSubmit={handleCreateMcpServer} className="space-y-4 text-xs">
                <Input
                  label="Nome do Servidor *"
                  placeholder="Ex: GitHub MCP Server"
                  value={serverName}
                  onChange={(e) => setServerName(e.target.value)}
                  required
                />

                <div className="space-y-1.5">
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider">
                    Conector / Provedor
                  </label>
                  <select
                    value={serverSlug}
                    onChange={(e) => {
                      setServerSlug(e.target.value);
                      if (!serverName) setServerName(`${e.target.value.toUpperCase()} MCP`);
                    }}
                    className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  >
                    <option value="github">GitHub MCP</option>
                    <option value="google-drive">Google Drive MCP</option>
                    <option value="notion">Notion MCP</option>
                    <option value="slack">Slack MCP</option>
                    <option value="discord">Discord MCP</option>
                    <option value="postgresql">PostgreSQL MCP</option>
                    <option value="mysql">MySQL MCP</option>
                    <option value="rest-api">API REST Genérica MCP</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block font-semibold text-slate-700 uppercase tracking-wider">
                      Tipo de Transporte
                    </label>
                    <select
                      value={serverType}
                      onChange={(e) => setServerType(e.target.value as any)}
                      className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    >
                      <option value="STDIO">STDIO (Processo Local)</option>
                      <option value="SSE">SSE (Server-Sent Events)</option>
                      <option value="HTTP">HTTP REST</option>
                    </select>
                  </div>

                  <Input
                    label="URL ou Comando"
                    placeholder="npx -y @modelcontextprotocol/server..."
                    value={urlOrCmd}
                    onChange={(e) => setUrlOrCmd(e.target.value)}
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" variant="primary" isLoading={modalLoading} rightIcon={<CheckCircle2 size={16} />}>
                    Conectar Servidor
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
