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
  BookOpen,
  Plus,
  FileText,
  FileSpreadsheet,
  Globe,
  Upload,
  Link as LinkIcon,
  Trash2,
  CheckCircle2,
  X,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export default function KnowledgeBasePage() {
  const [kbList, setKbList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal Nova Base
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // Modal Upload/Link Simulado
  const [activeKbId, setActiveKbId] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('PDF');
  const [siteUrl, setSiteUrl] = useState('');

  const fetchKnowledgeBases = async () => {
    setLoading(true);
    try {
      const response = await api.get('/ai-studio/knowledge');
      setKbList(response.data || []);
    } catch (err) {
      console.error('Erro ao buscar bases de conhecimento:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKnowledgeBases();
  }, []);

  const handleCreateKb = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');

    if (!name.trim()) {
      setModalError('O nome da base de conhecimento é obrigatório.');
      return;
    }

    setModalLoading(true);
    try {
      await api.post('/ai-studio/knowledge', { name, description });
      setIsModalOpen(false);
      setName('');
      setDescription('');
      fetchKnowledgeBases();
    } catch (err: any) {
      setModalError(err.response?.data?.message || 'Erro ao criar base de conhecimento.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleAddFile = async (kbId: string) => {
    if (!fileName.trim()) return;
    try {
      await api.post(`/ai-studio/knowledge/${kbId}/files`, { name: fileName, fileType });
      setFileName('');
      fetchKnowledgeBases();
    } catch (err) {
      console.error('Erro ao adicionar arquivo:', err);
    }
  };

  const handleAddPage = async (kbId: string) => {
    if (!siteUrl.trim()) return;
    try {
      await api.post(`/ai-studio/knowledge/${kbId}/pages`, { url: siteUrl, title: siteUrl });
      setSiteUrl('');
      fetchKnowledgeBases();
    } catch (err) {
      console.error('Erro ao adicionar site:', err);
    }
  };

  const handleDeleteKb = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta base de conhecimento?')) return;
    try {
      await api.delete(`/ai-studio/knowledge/${id}`);
      fetchKnowledgeBases();
    } catch (err) {
      console.error('Erro ao excluir base de conhecimento:', err);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <AiStudioHeader
          title="Bases de Conhecimento e Documentos (RAG)"
          subtitle="Cadastre PDFs, DOCX, Planilhas, FAQs e Sites para treinar o contexto dos seus Agentes."
          activeTab="Base de Conhecimento"
          action={
            <Button variant="primary" leftIcon={<Plus size={18} />} onClick={() => setIsModalOpen(true)}>
              Nova Base de Conhecimento
            </Button>
          }
        />

        <AiStudioNavigation />

        {/* Tipos Suportados Banner */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold flex items-center gap-2">
              <BookOpen className="text-brand-400" size={20} /> Formatos Suportados para RAG Contextual
            </h3>
            <p className="text-xs text-slate-400">
              Arquivos são processados e vetorizados para busca semântica em tempo real pelos Agentes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {['PDF', 'DOCX', 'TXT', 'CSV', 'Excel', 'FAQ', 'Website / Links'].map((fmt, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 font-mono font-semibold">
                {fmt}
              </span>
            ))}
          </div>
        </div>

        {/* Lista de Bases de Conhecimento */}
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs">Carregando bases de conhecimento...</div>
        ) : kbList.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-4 max-w-lg mx-auto my-8">
            <div className="p-4 rounded-full bg-brand-50 text-brand-600 w-16 h-16 mx-auto flex items-center justify-center">
              <BookOpen size={32} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Nenhuma Base de Conhecimento</h3>
              <p className="text-xs text-slate-500 mt-1">
                Crie uma base de dados para anexar manuais, catálogos e procedimentos à sua IA.
              </p>
            </div>
            <Button variant="primary" leftIcon={<Plus size={18} />} onClick={() => setIsModalOpen(true)}>
              Criar Primeira Base
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {kbList.map((kb) => (
              <div key={kb.id} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <BookOpen size={20} className="text-brand-500" /> {kb.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">{kb.description || 'Sem descrição.'}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="green">Pronto para RAG</Badge>
                    <button
                      onClick={() => handleDeleteKb(kb.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir Base"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Seção de Anexo de Arquivo & Link Simulado */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                    Adicionar Conteúdo à Base
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Anexo de Arquivo */}
                    <div className="flex items-center gap-2">
                      <select
                        value={fileType}
                        onChange={(e) => setFileType(e.target.value)}
                        className="rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-900"
                      >
                        <option value="PDF">PDF</option>
                        <option value="DOCX">DOCX</option>
                        <option value="TXT">TXT</option>
                        <option value="CSV">CSV</option>
                        <option value="EXCEL">Excel</option>
                        <option value="FAQ">FAQ</option>
                      </select>

                      <input
                        type="text"
                        placeholder="Nome do arquivo (ex: Manual_Vendas.pdf)"
                        value={activeKbId === kb.id ? fileName : ''}
                        onFocus={() => setActiveKbId(kb.id)}
                        onChange={(e) => {
                          setActiveKbId(kb.id);
                          setFileName(e.target.value);
                        }}
                        className="flex-1 rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-900"
                      />

                      <Button
                        size="sm"
                        variant="secondary"
                        leftIcon={<Upload size={14} />}
                        onClick={() => handleAddFile(kb.id)}
                      >
                        Simular Upload
                      </Button>
                    </div>

                    {/* Anexo de Link/Website */}
                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        placeholder="URL do site (ex: https://empresa.com/faq)"
                        value={activeKbId === kb.id ? siteUrl : ''}
                        onFocus={() => setActiveKbId(kb.id)}
                        onChange={(e) => {
                          setActiveKbId(kb.id);
                          setSiteUrl(e.target.value);
                        }}
                        className="flex-1 rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-900"
                      />

                      <Button
                        size="sm"
                        variant="outline"
                        leftIcon={<Globe size={14} />}
                        onClick={() => handleAddPage(kb.id)}
                      >
                        Indexar Link
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Arquivos e Links Cadastrados */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {/* Lista Arquivos */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-600 block">Arquivos da Base ({kb.files?.length || 0})</span>
                    {kb.files?.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">Nenhum arquivo adicionado.</p>
                    ) : (
                      kb.files.map((file: any) => (
                        <div key={file.id} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-white text-xs">
                          <div className="flex items-center gap-2">
                            <FileText size={16} className="text-brand-500" />
                            <span className="font-semibold text-slate-800">{file.name}</span>
                            <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-500">{file.fileType}</span>
                          </div>
                          <Badge variant="green">Vetorizado</Badge>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Lista Links */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-600 block">Páginas & Sites Indexados ({kb.pages?.length || 0})</span>
                    {kb.pages?.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">Nenhuma página indexada.</p>
                    ) : (
                      kb.pages.map((page: any) => (
                        <div key={page.id} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-white text-xs">
                          <div className="flex items-center gap-2 truncate">
                            <Globe size={16} className="text-indigo-500 shrink-0" />
                            <span className="font-semibold text-slate-800 truncate">{page.url}</span>
                          </div>
                          <Badge variant="blue">Indexado</Badge>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Nova Base */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="text-brand-500" /> Nova Base de Conhecimento
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

              <form onSubmit={handleCreateKb} className="space-y-4 text-xs">
                <Input
                  label="Nome da Base *"
                  placeholder="Ex: Documentação Comercial & FAQ"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                <div className="space-y-1.5">
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider">
                    Descrição
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Resuma o conteúdo contido nesta base..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" variant="primary" isLoading={modalLoading} rightIcon={<CheckCircle2 size={16} />}>
                    Criar Base
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
