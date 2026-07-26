'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../auth/AuthContext';
import { Logo } from '../components/Logo';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { PublicHeader } from '../components/PublicHeader';
import { PublicFooter } from '../components/PublicFooter';
import { api } from '../services/api';
import {
  Sparkles,
  ArrowRight,
  MessageCircle,
  ShieldAlert,
  HelpCircle,
  ChevronDown,
  CheckCircle2,
  DollarSign,
  Lock,
  Users,
  Target,
  Star,
  Check,
  Building,
  User,
  Mail,
  Phone,
  BarChart3,
} from 'lucide-react';

export default function HomePage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  
  // Lead form states
  const [leadForm, setLeadForm] = useState({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    usersCount: 5,
  });
  const [leadLoading, setLeadLoading] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState(false);
  const [leadError, setLeadError] = useState('');

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLeadLoading(true);
    setLeadError('');
    try {
      await api.post('/auth/commercial-lead', {
        ...leadForm,
        usersCount: Number(leadForm.usersCount),
      });
      setLeadSuccess(true);
      setLeadForm({ name: '', companyName: '', email: '', phone: '', usersCount: 5 });
    } catch (err: any) {
      setLeadError(err.response?.data?.message || 'Erro ao registrar interesse comercial. Verifique os dados.');
    } finally {
      setLeadLoading(false);
    }
  };

  const faqs = [
    {
      q: 'Como funciona o teste grátis de 14 dias?',
      a: 'Você se cadastra na plataforma sem precisar de cartão de crédito e tem acesso a 100% dos recursos do plano escolhido por 14 dias. Caso opte por não continuar, o cancelamento é gratuito.',
    },
    {
      q: 'Preciso instalar alguma infraestrutura local?',
      a: 'Não. O ConnectMax CRM IA é um software como serviço (SaaS) hospedado na nuvem. Você só precisa de um navegador e acesso à internet para operar.',
    },
    {
      q: 'Posso alterar meu plano ou cancelar a qualquer momento?',
      a: 'Sim. Pelo menu Faturamento no painel do cliente, você pode fazer upgrade, downgrade ou cancelar a assinatura instantaneamente sem burocracias.',
    },
    {
      q: 'Meus dados comerciais ficam seguros e isolados?',
      a: 'Sim. Construído com uma arquitetura estrita de multi-tenancy, seus dados são isolados a nível de banco de dados e todas as operações geram logs de auditoria automáticos.',
    },
  ];

  const plans = [
    {
      name: 'Starter',
      description: 'Ideal para pequenas equipes de vendas iniciando automações.',
      price: '99',
      popular: false,
      ctaText: 'Testar Starter Grátis',
      features: [
        'Até 3 usuários',
        'Até 500 contatos',
        'Funil Kanban de 7 etapas',
        'Faturamento CRM simplificado',
        'Isolamento Multi-Tenant estrito',
      ],
    },
    {
      name: 'Professional',
      description: 'Foco em escala comercial com robô inteligente de WhatsApp.',
      price: '299',
      popular: true,
      ctaText: 'Testar Professional Grátis',
      features: [
        'Até 10 usuários',
        'Até 5.000 contatos',
        'Todas as features do Starter',
        'Integração WhatsApp Bot Inteligente',
        'Qualificação de Leads com IA (HOT/COLD)',
        'Suporte prioritário 24/7',
      ],
    },
    {
      name: 'Enterprise',
      description: 'Solução corporativa completa com suporte ilimitado e RAG.',
      price: '799',
      popular: false,
      ctaText: 'Falar com Consultor',
      features: [
        'Usuários ilimitados',
        'Contatos ilimitados',
        'Tudo do Professional',
        'Assistente IA RAG Avançado',
        'Auditoria e segurança avançada',
        'SLA garantido em contrato',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-brand-500 selection:text-white">
      {/* HEADER */}
      <PublicHeader />

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-24 overflow-hidden border-b border-slate-900">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(circle_at_center,_rgba(37,99,235,0.07)_0%,_transparent_60%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6 text-left">
            <Badge variant="blue">Lançamento SaaS Oficial 🚀</Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              O CRM Inteligente com <span className="text-brand-400">WhatsApp IA</span> Integrado
            </h1>
            <p className="text-base sm:text-lg text-slate-400 max-w-xl leading-relaxed">
              Capture leads automáticos pelo WhatsApp, qualifique oportunidades com inteligência artificial RAG e gerencie suas contas financeiras em um ecossistema multi-tenant premium.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/register?plan=Professional">
                <span>
                  <Button variant="primary" size="lg" className="shadow-lg shadow-brand-500/25">
                    Começar Teste Grátis
                  </Button>
                </span>
              </Link>
              <Link href="/demo">
                <span>
                  <Button variant="outline" size="lg" className="border-slate-800 text-slate-350 hover:bg-slate-900">
                    Ver Demonstração
                  </Button>
                </span>
              </Link>
            </div>
          </div>

          {/* Simulated Dashboard Preview Mockup */}
          <div className="lg:col-span-6 relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-500 to-indigo-600 rounded-2xl blur opacity-30 animate-pulse" />
            <div className="relative bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-slate-700" />
                  <div className="w-3 h-3 rounded-full bg-slate-700" />
                  <div className="w-3 h-3 rounded-full bg-slate-700" />
                  <span className="text-xs text-slate-500 font-mono ml-2">dashboard.connectmaxcrm.com</span>
                </div>
                <Badge variant="blue">SaaS Core 2.0</Badge>
              </div>

              {/* Mock content */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-950/40 border border-slate-850 rounded-xl space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Vendas Ganhas</span>
                    <div className="text-base font-bold text-white font-mono">R$ 148.500</div>
                  </div>
                  <div className="p-4 bg-slate-950/40 border border-slate-850 rounded-xl space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Leads Inteligentes</span>
                    <div className="text-base font-bold text-brand-400 font-mono">94.2% HOT</div>
                  </div>
                </div>
                <div className="p-3 bg-brand-500/10 border border-brand-500/20 text-[11px] text-brand-300 rounded-xl leading-relaxed">
                  💬 **WhatsApp IA**: "Detectado interesse de fechamento em *Nexus Tech*. Recomendo envio de proposta."
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POR QUE ESCOLHER O CONNECTMAX */}
      <section className="py-24 bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <Badge variant="blue">Diferenciais</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Por Que Escolher o ConnectMax CRM IA?</h2>
            <p className="text-slate-400 text-sm">
              Mais que um gerenciador de contatos: uma engrenagem inteligente construída para fechar vendas no piloto automático.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="p-3 bg-brand-500/10 text-brand-400 rounded-xl w-fit"><Sparkles size={20} /></div>
              <h3 className="text-lg font-bold text-white">Assistência IA RAG</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Nossos modelos compreendem o histórico do cliente e geram insights automáticos de abordagem e resumos executivos.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="p-3 bg-brand-500/10 text-brand-400 rounded-xl w-fit"><MessageCircle size={20} /></div>
              <h3 className="text-lg font-bold text-white">WhatsApp Oficial Integrado</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Respostas em milissegundos a potenciais leads e transferência humana sem que o cliente perca tempo na fila de atendimento.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="p-3 bg-brand-500/10 text-brand-400 rounded-xl w-fit"><Lock size={20} /></div>
              <h3 className="text-lg font-bold text-white">Arquitetura de Isolamento</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dados protegidos por segurança multi-tenant estrita. Auditoria nativa de todas as ações de usuários.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CONNECTMAX VS TRADICIONAL COMPARISON */}
      <section className="py-24 border-y border-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <Badge variant="blue">Comparativo</Badge>
            <h2 className="text-3xl font-extrabold text-white">ConnectMax vs CRM Tradicional</h2>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-950/60 border-b border-slate-850 text-slate-350 font-bold uppercase tracking-wider">
                  <th className="p-4">Recurso / Diferencial</th>
                  <th className="p-4 text-brand-400">ConnectMax CRM IA</th>
                  <th className="p-4 text-slate-500">CRM Tradicional</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 text-slate-300">
                <tr className="hover:bg-slate-900/40">
                  <td className="p-4 font-semibold">Respostas por IA via WhatsApp</td>
                  <td className="p-4 text-emerald-400 font-bold flex items-center gap-1.5"><Check size={16} /> Nativo</td>
                  <td className="p-4 text-slate-500">Não possui ou requer integração</td>
                </tr>
                <tr className="hover:bg-slate-900/40">
                  <td className="p-4 font-semibold">Qualificação Inteligente (HOT)</td>
                  <td className="p-4 text-emerald-400 font-bold flex items-center gap-1.5"><Check size={16} /> Automático</td>
                  <td className="p-4 text-slate-500">Manual / Estático</td>
                </tr>
                <tr className="hover:bg-slate-900/40">
                  <td className="p-4 font-semibold">Faturamento & Cobrança Vinculada</td>
                  <td className="p-4 text-emerald-400 font-bold flex items-center gap-1.5"><Check size={16} /> Integrado</td>
                  <td className="p-4 text-slate-500">Requer sistema ERP externo</td>
                </tr>
                <tr className="hover:bg-slate-900/40">
                  <td className="p-4 font-semibold">Isolamento Multi-Tenant Estrito</td>
                  <td className="p-4 text-emerald-400 font-bold flex items-center gap-1.5"><Check size={16} /> Garantido</td>
                  <td className="p-4 text-slate-500">Sob demanda / Customizado</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* PLANOS */}
      <section id="planos" className="py-24 relative overflow-hidden">
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-brand-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <Badge variant="green">Preços Transparentes</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Escolha o Plano Perfeito para Sua Operação
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              Inicie com 14 dias grátis em qualquer plano comercial. Altere ou cancele a assinatura quando quiser.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((p) => (
              <div
                key={p.name}
                className={`rounded-2xl bg-slate-900/80 backdrop-blur-md p-8 border transition-all duration-300 flex flex-col justify-between space-y-6 ${
                  p.popular
                    ? 'border-2 border-brand-500 shadow-2xl shadow-brand-500/10 scale-105 relative z-10'
                    : 'border-slate-800/80 hover:border-slate-700/80'
                }`}
              >
                {p.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4.5 py-1 rounded-full bg-brand-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-md">
                    Mais Popular ⭐
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{p.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{p.description}</p>
                  </div>

                  <div>
                    <span className="text-4xl font-extrabold text-white font-mono">R$ {p.price}</span>
                    <span className="text-xs text-slate-500 font-semibold"> /mês</span>
                  </div>

                  <div className="pt-5 border-t border-slate-800/80 space-y-3.5 text-xs">
                    {p.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-slate-300">
                        <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link href={`/register?plan=${p.name}`} className="w-full">
                  <Button
                    variant={p.popular ? 'primary' : 'outline'}
                    className={`w-full py-3.5 font-bold ${
                      !p.popular
                        ? 'border-slate-800 text-slate-300 hover:bg-slate-850'
                        : 'shadow-md shadow-brand-500/20'
                    }`}
                    rightIcon={<ArrowRight size={16} />}
                  >
                    {p.ctaText}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS DE CLIENTES */}
      <section className="py-24 bg-slate-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <Badge variant="blue">Depoimentos</Badge>
            <h2 className="text-3xl font-extrabold text-white">O Que Nossos Clientes Dizem</h2>
            <p className="text-slate-400 text-xs">Empresas que escalaram suas vendas e simplificaram o suporte comercial com o ConnectMax.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex gap-1 text-amber-400"><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /></div>
              <p className="text-xs text-slate-350 leading-relaxed">
                "A qualificação de leads com a IA RAG do ConnectMax reduziu nosso tempo de resposta para 2 segundos. Nossa taxa de fechamento subiu 34% em 60 dias de uso da plataforma."
              </p>
              <div className="pt-4 border-t border-slate-850 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-xs">CV</div>
                <div>
                  <strong className="text-xs text-white block">Carlos Viana</strong>
                  <span className="text-[9.5px] text-slate-500">Diretor de Vendas - Acme Tech</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex gap-1 text-amber-400"><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /></div>
              <p className="text-xs text-slate-350 leading-relaxed">
                "O robô inteligente de WhatsApp responde 80% das dúvidas recorrentes dos clientes. O transbordo de atendimento para nosso comercial humano funciona de maneira perfeita."
              </p>
              <div className="pt-4 border-t border-slate-850 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-xs">AC</div>
                <div>
                  <strong className="text-xs text-white block">Ana Clara</strong>
                  <span className="text-[9.5px] text-slate-500">CEO - Inova Digital</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex gap-1 text-amber-400"><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /></div>
              <p className="text-xs text-slate-350 leading-relaxed">
                "O isolamento multi-tenant estrito e os logs de auditoria detalhados nos deram a segurança para migrar nossa operação corporativa para o ConnectMax sem hesitação."
              </p>
              <div className="pt-4 border-t border-slate-850 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-xs">RD</div>
                <div>
                  <strong className="text-xs text-white block">Roberto Dias</strong>
                  <span className="text-[9.5px] text-slate-500">VP de Operações - Nexus S.A.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CAPTURA COMERCIAL FORM */}
      <section className="py-24 bg-slate-900/30 border-y border-slate-900">
        <div className="max-w-xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center space-y-3">
            <Badge variant="blue">Contato Comercial</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Tenho Interesse Comercial</h2>
            <p className="text-xs text-slate-450">Complete o formulário abaixo e receba atendimento personalizado de um consultor.</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
            {leadSuccess ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 size={48} className="text-emerald-400 mx-auto" />
                <h3 className="text-lg font-bold text-white">Mensagem Enviada!</h3>
                <p className="text-xs text-slate-400">Nossa equipe entrará em contato comercial via WhatsApp nas próximas horas.</p>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                {leadError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg flex items-center gap-2">
                    <ShieldAlert size={16} />
                    <span>{leadError}</span>
                  </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-350 block">Seu Nome *</label>
                    <input
                      type="text"
                      required
                      value={leadForm.name}
                      onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                      placeholder="Ex: João Silva"
                      className="w-full h-10 bg-slate-950 border border-slate-800 rounded-lg px-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-350 block">Nome da Empresa *</label>
                    <input
                      type="text"
                      required
                      value={leadForm.companyName}
                      onChange={(e) => setLeadForm({ ...leadForm, companyName: e.target.value })}
                      placeholder="Ex: Inova Tech"
                      className="w-full h-10 bg-slate-950 border border-slate-800 rounded-lg px-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-350 block">E-mail Corporativo *</label>
                    <input
                      type="email"
                      required
                      value={leadForm.email}
                      onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                      placeholder="joao@empresa.com"
                      className="w-full h-10 bg-slate-950 border border-slate-800 rounded-lg px-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-350 block">WhatsApp com DDD *</label>
                    <input
                      type="text"
                      required
                      value={leadForm.phone}
                      onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                      placeholder="(11) 98888-7777"
                      className="w-full h-10 bg-slate-950 border border-slate-800 rounded-lg px-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-350 block">Quantidade Estimada de Usuários *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={leadForm.usersCount}
                    onChange={(e) => setLeadForm({ ...leadForm, usersCount: Number(e.target.value) })}
                    className="w-full h-10 bg-slate-950 border border-slate-800 rounded-lg px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>

                <Button variant="primary" type="submit" className="w-full py-3 mt-2" isLoading={leadLoading}>
                  Enviar Formulário de Interesse
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="blue">Dúvidas Frequentes</Badge>
          <h2 className="text-3xl font-extrabold text-white">Perguntas Frequentes (FAQ)</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden transition-colors hover:bg-slate-900/80">
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                className="w-full p-5 text-left font-bold text-sm text-white flex items-center justify-between focus:outline-none"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-slate-400 transition-transform duration-200 ${openFaqIndex === idx ? 'rotate-180 text-brand-400' : ''}`}
                />
              </button>

              {openFaqIndex === idx && (
                <div className="px-5 pb-5 text-xs text-slate-400 border-t border-slate-800/50 pt-3.5 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-t border-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Comece agora seu teste gratuito</h2>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            Descubra como o ConnectMax CRM IA automatiza suas vendas no WhatsApp e otimiza seu fluxo financeiro corporativo.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/register?plan=Professional">
              <span>
                <Button variant="primary" size="lg">Experimentar 14 Dias Grátis</Button>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <PublicFooter />
    </div>
  );
}
