'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';
import { AiStudioHeader } from '../../../../components/ai-studio/AiStudioHeader';
import { KnowledgeHubNavigation } from '../../../../components/ai-studio/KnowledgeHubNavigation';
import { Button } from '../../../../components/Button';
import { Input } from '../../../../components/Input';
import { api } from '../../../../services/api';
import { FileText, Upload, History, Search, Plus, X, CheckCircle2 } from 'lucide-react';

export default function KnowledgeDocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [libraries, setLibraries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const [uploadData, setUploadData] = useState({
    libraryId: '',
    name: '',
    fileType: 'PDF',
    content: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [docsRes, libsRes] = await Promise.all([
        api.get('/ai-studio/knowledge-hub/documents'),
        api.get('/ai-studio/knowledge-hub/libraries'),
      ]);
      setDocuments(docsRes.data || []);
      setLibraries(libsRes.data || []);
      if (libsRes.data?.length > 0) {
        setUploadData((prev) => ({ ...prev, libraryId: libsRes.data[0].id }));
      }
    } catch (err) {
      console.error('Erro ao buscar documentos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadData.name.trim() || !uploadData.libraryId) return;

    try {
      await api.post('/ai-studio/knowledge-hub/documents', uploadData);
      setIsUploadModalOpen(false);
      setUploadData({ libraryId: libraries[0]?.id || '', name: '', fileType: 'PDF', content: '' });
      fetchData();
    } catch (err) {
      console.error('Erro ao enviar documento:', err);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <AiStudioHeader
          title="Documentos & Versionamento"
          subtitle="Suporte para PDF, DOCX, XLSX, CSV, TXT, Markdown, HTML e JSON com controle de versão."
          activeTab="Base de Conhecimento"
          action={
            <Button variant="primary" leftIcon={<Upload size={18} />} onClick={() => setIsUploadModalOpen(true)}>
              Enviar Documento
            </Button>
          }
        />

        <KnowledgeHubNavigation />

        {/* Formatos Suportados Badge Bar */}
        <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <FileText className="text-brand-400" size={18} />
            <span className="font-bold">Formatos Suportados no Hub:</span>
          </div>
          <div className="flex flex-wrap gap-1.5 font-mono">
            {['PDF', 'DOCX', 'XLSX', 'CSV', 'TXT', 'MD', 'HTML', 'JSON'].map((fmt) => (
              <span key={fmt} className="px-2 py-0.5 rounded bg-slate-800 text-brand-300 font-bold border border-slate-700">
                {fmt}
              </span>
            ))}
          </div>
        </div>

        {/* Tabela de Documentos */}
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs">Carregando documentos...</div>
        ) : documents.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-3 max-w-md mx-auto my-8">
            <FileText size={36} className="mx-auto text-slate-400" />
            <h3 className="text-sm font-bold text-slate-900">Nenhum Documento Cadastrado</h3>
            <p className="text-xs text-slate-500">Envie o seu primeiro arquivo para alimentar a base de conhecimento.</p>
            <Button variant="primary" size="sm" onClick={() => setIsUploadModalOpen(true)}>
              Enviar Primeiro Documento
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                <tr>
                  <th className="p-4">Documento</th>
                  <th className="p-4">Biblioteca</th>
                  <th className="p-4">Formato</th>
                  <th className="p-4">Versão</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                      <FileText size={16} className="text-brand-500" /> {doc.name}
                    </td>
                    <td className="p-4 text-slate-600">{doc.library?.name || 'Geral'}</td>
                    <td className="p-4 font-mono font-bold text-indigo-600">{doc.fileType}</td>
                    <td className="p-4 font-mono font-bold">
                      <span className="bg-brand-50 text-brand-700 px-2 py-0.5 rounded border border-brand-200">
                        v{doc.version}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 size={14} /> Pronto
                      </span>
                    </td>
                    <td className="p-4 text-right text-slate-400 font-mono">
                      {new Date(doc.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal de Upload */}
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-bold text-base text-slate-900">Enviar Documento ao Knowledge Hub</h3>
                <button onClick={() => setIsUploadModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">Biblioteca Destino</label>
                  <select
                    value={uploadData.libraryId}
                    onChange={(e) => setUploadData({ ...uploadData, libraryId: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2.5 bg-white text-slate-900"
                    required
                  >
                    {libraries.map((lib) => (
                      <option key={lib.id} value={lib.id}>
                        {lib.name} ({lib.category})
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Nome do Documento *"
                  placeholder="Ex: Manual de Produtos 2026.pdf"
                  value={uploadData.name}
                  onChange={(e) => setUploadData({ ...uploadData, name: e.target.value })}
                  required
                />

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">Formato do Arquivo</label>
                  <select
                    value={uploadData.fileType}
                    onChange={(e) => setUploadData({ ...uploadData, fileType: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2.5 bg-white text-slate-900"
                  >
                    {['PDF', 'DOCX', 'XLSX', 'CSV', 'TXT', 'MD', 'HTML', 'JSON'].map((fmt) => (
                      <option key={fmt} value={fmt}>
                        {fmt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">Conteúdo Textual (Indexação Inicial)</label>
                  <textarea
                    rows={4}
                    placeholder="Cole o conteúdo relevante do documento para indexação..."
                    value={uploadData.content}
                    onChange={(e) => setUploadData({ ...uploadData, content: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 font-mono"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <Button type="button" variant="outline" size="sm" onClick={() => setIsUploadModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" variant="primary" size="sm">
                    Enviar Documento
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
