'use client';

import React, { useState } from 'react';
import { Logo } from '../../components/Logo';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import {
  HelpCircle,
  Search,
  MessageSquare,
  Users,
  Sparkles,
  Phone,
  ArrowRight,
  ChevronDown,
  ArrowLeft,
  Building,
} from 'lucide-react';
import Link from 'next/link';

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);

  const categories = [
    { id: 'whatsapp', label: 'Integração WhatsApp', icon: <Phone size={16} /> },
    { id: 'ia', label: 'Inteligência Artificial', icon: <Sparkles size={16} /> },
    { id: 'users', label: 'Gestão de Usuários', icon: <Users size={16} /> },
    { id: 'billing', label: 'Planos & Cobrança', icon: <Building size={16} /> },
  ];

  const articles = [
    {
      id: 1,
      title: 'Como conectar o robô de WhatsApp IA ao sistema?',
      category: 'whatsapp',
      summary: 'Aprenda o passo a passo para conectar o WhatsApp oficial via QR Code ou token Meta API.',
      content: `Para conectar o robô inteligente ao seu WhatsApp comercial:
1. Acesse o menu **WhatsApp** no painel lateral do ConnectMax CRM IA.
2. Clique em **Conectar WhatsApp**.
3. Escaneie o QR Code exibido em sua tela com o aplicativo do WhatsApp do seu celular (Menu > Aparelhos conectados > Conectar um aparelho).
4. Uma vez conectado, configure a mensagem de saudação automática e ative a IA para o modo de atendimento automático.`,
    },
    {
      id: 2,
      title: 'Como funciona a qualificação automática de leads?',
      category: 'ia',
      summary: 'Entenda como nossa inteligência artificial qualifica contatos em HOT ou COLD.',
      content: `A qualificação automática de leads utiliza aprendizado de máquina para analisar as mensagens de bate-papo:
- **HOT**: Quando o lead manifesta interesse direto de compra, agendamento de reuniões ou solicita propostas comerciais. A IA sinaliza imediatamente no CRM e notifica a equipe.
- **COLD**: Para contatos que enviam mensagens irrelevantes ou fora do escopo de contratação.
Você pode visualizar o score em tempo real na aba de Leads do Dashboard.`,
    },
    {
      id: 3,
      title: 'Como convidar novos membros para a equipe (RBAC)?',
      category: 'users',
      summary: 'Passo a passo para convidar funcionários e gerenciar suas funções hierárquicas.',
      content: `O controle de permissões (RBAC) garante o isolamento e atribuição adequada:
1. No menu lateral, acesse **Configurações > Equipe**.
2. Clique em **Convidar Usuário**.
3. Insira o nome, e-mail e atribua a função desejada:
   - **COMPANY_ADMIN**: Acesso completo ao faturamento, configurações e relatórios.
   - **USER**: Operação normal do CRM (atendimento a leads, tarefas e kanban).
4. O usuário receberá um convite por e-mail para cadastrar sua senha.`,
    },
    {
      id: 4,
      title: 'Como atualizar ou cancelar o plano contratado?',
      category: 'billing',
      summary: 'Gerencie sua assinatura, consulte faturas e faça upgrades dinâmicos.',
      content: `Todo o faturamento do ConnectMax CRM IA é integrado de forma transparente:
1. Acesse o menu **Assinatura / Faturamento** no seu Dashboard.
2. Lá você verá o plano atual (Starter, Professional ou Enterprise) e o status (Trial, Ativo, etc.).
3. Clique em **Upgrade de Plano** para ser direcionado ao checkout e efetuar o pagamento.
4. Para cancelar ou consultar histórico de pagamentos, utilize o botão de gerenciamento do portal de faturamento. O cancelamento é imediato e sem multas.`,
    },
  ];

  const filteredArticles = articles.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory ? art.category === activeCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      
      {/* Help Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo variant="dark" size="md" />
            <Badge variant="blue">Central de Ajuda</Badge>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/">
              <span className="text-xs text-slate-400 hover:text-white cursor-pointer transition-colors">Voltar ao site</span>
            </Link>
            <Link href="/support">
              <span>
                <Button variant="primary" size="sm">Abrir Chamado</Button>
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 flex-grow space-y-10 w-full">
        {selectedArticle ? (
          // Article view
          <div className="space-y-6">
            <button
              onClick={() => setSelectedArticle(null)}
              className="inline-flex items-center gap-1.5 text-xs text-slate-450 hover:text-white transition-colors"
            >
              <ArrowLeft size={16} /> Voltar para os artigos
            </button>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="space-y-2">
                <Badge variant="blue">{selectedArticle.category.toUpperCase()}</Badge>
                <h1 className="text-xl sm:text-2xl font-bold text-white">{selectedArticle.title}</h1>
              </div>
              <div className="text-xs sm:text-sm text-slate-350 leading-relaxed whitespace-pre-line border-t border-slate-850 pt-6">
                {selectedArticle.content}
              </div>
            </div>
          </div>
        ) : (
          // Search & List View
          <div className="space-y-10">
            {/* Search Hero */}
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-extrabold text-white">Como podemos ajudar você hoje?</h1>
              <p className="text-xs text-slate-400">Pesquise por artigos de configuração, dúvidas comerciais e suporte da IA.</p>
              
              <div className="max-w-md mx-auto relative pt-2">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 mt-1" size={18} />
                <input
                  type="text"
                  placeholder="Pesquise por termos como 'WhatsApp', 'Permissões'..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 pl-11 pr-4 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                  className={`p-4 rounded-xl border text-center flex flex-col items-center gap-3 transition-all ${
                    activeCategory === cat.id
                      ? 'bg-brand-500 border-brand-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <div className={`p-2.5 rounded-lg ${activeCategory === cat.id ? 'bg-white/10' : 'bg-slate-950/40'}`}>
                    {cat.icon}
                  </div>
                  <span className="text-[11px] font-semibold">{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Articles List */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-slate-350">Artigos de Ajuda</h2>
              <div className="grid grid-cols-1 gap-4">
                {filteredArticles.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-500 border border-dashed border-slate-850 rounded-xl">
                    Nenhum artigo encontrado para a pesquisa correspondente.
                  </div>
                ) : (
                  filteredArticles.map((art) => (
                    <div
                      key={art.id}
                      onClick={() => setSelectedArticle(art)}
                      className="p-5 rounded-xl bg-slate-900/60 border border-slate-850 hover:border-slate-800 hover:bg-slate-900 transition-all cursor-pointer flex justify-between items-center gap-4 group"
                    >
                      <div className="space-y-1">
                        <strong className="text-xs sm:text-sm text-white block group-hover:text-brand-400 transition-colors">
                          {art.title}
                        </strong>
                        <p className="text-[11px] text-slate-455">{art.summary}</p>
                      </div>
                      <ChevronDown size={18} className="text-slate-500 -rotate-90 shrink-0 group-hover:text-brand-400" />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Help Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        © 2026 ConnectMax CRM IA. Todos os direitos reservados.
      </footer>
    </div>
  );
}
