'use client';

import React from 'react';
import Link from 'next/link';
import { PublicHeader } from '../../components/PublicHeader';
import { PublicFooter } from '../../components/PublicFooter';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import {
  Sparkles,
  Target,
  MessageCircle,
  DollarSign,
  Users,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  Clock,
  ShieldAlert,
  Search,
} from 'lucide-react';

export default function RecursosPage() {
  const recursos = [
    {
      icon: <Target size={28} className="text-brand-400" />,
      title: 'Funil de Vendas Kanban',
      description:
        'Acompanhe seus negócios em um painel interativo de 7 colunas, da captação até a venda fechada. Veja os totais monetários em tempo real por etapa e mova cards com arrastar-e-soltar.',
      details: ['7 estágios padrão da metodologia Inbound', 'Valores de oportunidades somados por coluna', 'Filtro por vendedor e responsável', 'Design extremamente responsivo'],
    },
    {
      icon: <MessageCircle size={28} className="text-emerald-400" />,
      title: 'Integração de Atendimento WhatsApp',
      description:
        'Centralize todas as conversas em uma caixa de entrada multi-agente. Tenha robôs inteligentes respondendo instantaneamente e criando leads no funil de forma 100% automatizada.',
      details: ['Inbox centralizado por tenant', 'Inteligência de conversação e detecção de leads', 'Copilot de sugestão de respostas', 'Transbordo simples para consultores humanos'],
    },
    {
      icon: <Sparkles size={28} className="text-indigo-400" />,
      title: 'Inteligência Artificial ConnectMax',
      description:
        'Nossa IA nativa ajuda a economizar tempo de análise. Obtenha resumos executivos instantâneos de clientes e deixe que o algoritmo qualifique automaticamente seus Leads.',
      details: ['Qualificação de Leads (HOT 🔥, WARM ⚠️, COLD ❄️)', 'Resumos gerados em 1 clique para qualquer cliente', 'Chat Assistente no Dashboard que responde sobre dados do CRM', 'RAG (Retrieval-Augmented Generation) com isolamento estrito'],
    },
    {
      icon: <DollarSign size={28} className="text-rose-400" />,
      title: 'CRM Financeiro Completo',
      description:
        'Chega de planilhas financeiras separadas. Gerencie suas Contas a Receber e Contas a Pagar diretamente atreladas às contas dos seus clientes e controle o fluxo de caixa do negócio.',
      details: ['Contas a receber com status pendente/pago/atrasado', 'Contas a pagar organizadas por categorias', 'Cálculo de receita recorrente mensal (MRR)', 'Gráficos de fluxo de caixa operacional'],
    },
    {
      icon: <Calendar size={28} className="text-amber-400" />,
      title: 'Agenda & Atividades Integradas',
      description:
        'Organize o relacionamento com lembretes, histórico de reuniões virtuais e chamadas telefônicas registradas na timeline de cada contato. Não perca nenhum acompanhamento.',
      details: ['Tarefas organizadas por prioridade', 'Calendário de reuniões e compromissos', 'Timeline de interações unificada por contato', 'Design focado em produtividade diária'],
    },
    {
      icon: <Layers size={28} className="text-blue-400" />,
      title: 'Painel Executivo Super Admin',
      description:
        'Para os proprietários da plataforma ou grandes empresas administradoras, o sistema disponibiliza um painel central de monitoramento de MRR, gerenciamento de tenants e logs.',
      details: ['Acompanhamento de MRR global', 'Gestão de status de empresas clientes (Ativar/Bloquear)', 'Atribuição manual de planos', 'Trilha de auditoria global completa'],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-brand-500 selection:text-white">
      <PublicHeader />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden border-b border-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <Badge variant="blue">Recursos Premium</Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Ferramentas Avançadas para Escalabilidade Comercial
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base font-normal">
            Descubra todos os recursos desenhados para automatizar sua atração, relacionamento e fechamento de vendas com controle total e segurança multi-tenant.
          </p>
        </div>
      </section>

      {/* Recursos Detalhados */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {recursos.map((rec, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 hover:border-brand-500/30 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-slate-850 border border-slate-800 w-fit">
                  {rec.icon}
                </div>
                <h3 className="text-xl font-bold text-white">{rec.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{rec.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                  {rec.details.map((detail, dIdx) => (
                    <div key={dIdx} className="flex items-center gap-2 text-slate-300 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Seção CTA */}
      <section className="py-20 bg-slate-900/40 border-t border-slate-900 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-brand-600/10 via-transparent to-transparent blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-8">
          <h2 className="text-3xl font-extrabold text-white">
            Pronto para impulsionar suas vendas com inteligência artificial?
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto text-xs leading-relaxed">
            Ative hoje mesmo seu período de teste grátis no plano Professional e conecte sua operação ao WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register?plan=Professional" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto text-sm px-8 py-3.5" rightIcon={<ArrowRight size={18} />}>
                Testar 14 Dias Grátis
              </Button>
            </Link>
            <Link href="/planos" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-sm px-8 py-3.5 border-slate-750 text-slate-300 hover:bg-slate-800">
                Ver Comparativo de Planos
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
