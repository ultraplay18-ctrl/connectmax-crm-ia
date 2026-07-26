'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';
import { AiStudioHeader } from '../../../../components/ai-studio/AiStudioHeader';
import { KnowledgeHubNavigation } from '../../../../components/ai-studio/KnowledgeHubNavigation';
import { Button } from '../../../../components/Button';
import { Input } from '../../../../components/Input';
import { api } from '../../../../services/api';
import { HelpCircle, Plus, Search, X } from 'lucide-react';

export default function KnowledgeFaqPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [libraries, setLibraries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [faqForm, setFaqForm] = useState({
    libraryId: '',
    question: '',
    answer: '',
    category: 'Geral',
    tags: 'suporte,duvidas',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [faqsRes, libsRes] = await Promise.all([
        api.get('/ai-studio/knowledge-hub/faqs'),
        api.get('/ai-studio/knowledge-hub/libraries'),
      ]);
      setFaqs(faqsRes.data || []);
      setLibraries(libsRes.data || []);
      if (libsRes.data?.length > 0) {
        setFaqForm((prev) => ({ ...prev, libraryId: libsRes.data[0].id }));
      }
    } catch (err) {
      console.error('Erro ao buscar FAQs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqForm.question.trim() || !faqForm.answer.trim() || !faqForm.libraryId) return;

    try {
      await api.post('/ai-studio/knowledge-hub/faqs', faqForm);
      setIsModalOpen(false);
      setFaqForm({ libraryId: libraries[0]?.id || '', question: '', answer: '', category: 'Geral', tags: 'suporte,duvidas' });
      fetchData();
    } catch (err) {
      console.error('Erro ao cadastrar FAQ:', err);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <AiStudioHeader
          title="Central de FAQs (Perguntas & Respostas)"
          subtitle="Cadastre respostas objetivas organizadas por categorias e tags para os Agentes de IA."
          activeTab="Base de Conhecimento"
          action={
            <Button variant="primary" leftIcon={<Plus size={18} />} onClick={() => setIsModalOpen(true)}>
              Nova Pergunta (FAQ)
            </Button>
          }
        />

        <KnowledgeHubNavigation />

        {/* Lista de FAQs */}
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs">Carregando FAQs...</div>
        ) : faqs.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-3 max-w-md mx-auto my-8">
            <HelpCircle size={36} className="mx-auto text-slate-400" />
            <h3 className="text-sm font-bold text-slate-900">Nenhuma FAQ Cadastrada</h3>
            <p className="text-xs text-slate-500">Cadastre perguntas frequentes para respostas instantâneas dos assistentes.</p>
            <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
              Cadastrar Primeira FAQ
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.id} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <HelpCircle className="text-brand-500" size={16} /> {faq.question}
                  </h4>
                  <span className="text-[10px] font-mono bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-200">
                    {faq.library?.name || 'Geral'}
                  </span>
                </div>
                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Modal de Criação */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-bold text-base text-slate-900">Cadastrar Nova Pergunta (FAQ)</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateFaq} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">Biblioteca</label>
                  <select
                    value={faqForm.libraryId}
                    onChange={(e) => setFaqForm({ ...faqForm, libraryId: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2.5 bg-white text-slate-900"
                    required
                  >
                    {libraries.map((lib) => (
                      <option key={lib.id} value={lib.id}>
                        {lib.name}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Pergunta (Dúvida Frequente) *"
                  placeholder="Ex: Quais são as formas de pagamento aceitas?"
                  value={faqForm.question}
                  onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                  required
                />

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">Resposta Oficial *</label>
                  <textarea
                    rows={4}
                    placeholder="Digite a resposta direta e precisa..."
                    value={faqForm.answer}
                    onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" variant="primary" size="sm">
                    Salvar FAQ
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
