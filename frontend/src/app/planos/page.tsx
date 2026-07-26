'use client';

import React from 'react';
import Link from 'next/link';
import { PublicHeader } from '../../components/PublicHeader';
import { PublicFooter } from '../../components/PublicFooter';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Check, X, ArrowRight, Sparkles, HelpCircle } from 'lucide-react';

export default function PlanosPage() {
  const plans = [
    {
      name: 'Starter',
      price: 'R$ 99',
      description: 'Estruturação inicial para equipes pequenas.',
      maxUsers: '3 usuários',
      maxContacts: '500 contatos',
      ctaHref: '/register?plan=Starter',
      popular: false,
    },
    {
      name: 'Professional',
      price: 'R$ 299',
      description: 'IA, automações e atendimento WhatsApp integrado.',
      maxUsers: '10 usuários',
      maxContacts: '5.000 contatos',
      ctaHref: '/register?plan=Professional',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'R$ 799',
      description: 'Escalabilidade sem limites e suporte dedicado.',
      maxUsers: 'Ilimitado',
      maxContacts: '50.000 contatos',
      ctaHref: '/register?plan=Enterprise',
      popular: false,
    },
  ];

  const featuresComparison = [
    { name: 'Usuários incluídos', starter: '3', professional: '10', enterprise: 'Ilimitado' },
    { name: 'Limite de Contatos/Clientes', starter: '500', professional: '5.000', enterprise: '50.000' },
    { name: 'Funil de Vendas Kanban', starter: true, professional: true, enterprise: true },
    { name: 'Agenda & Atividades', starter: true, professional: true, enterprise: true },
    { name: 'ConnectMax IA Assistente', starter: false, professional: true, enterprise: true },
    { name: 'Qualificação Inteligente de Leads', starter: false, professional: true, enterprise: true },
    { name: 'Caixas de atendimento WhatsApp', starter: false, professional: '1 ativa', enterprise: 'Múltiplas' },
    { name: 'Financeiro Operacional unificado', starter: false, professional: true, enterprise: true },
    { name: 'Trilha de Auditoria & Segurança', starter: true, professional: true, enterprise: true },
    { name: 'Suporte Técnico', starter: 'E-mail', professional: 'Prioritário (E-mail/Chat)', enterprise: 'SLA dedicado 24/7' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-brand-500 selection:text-white">
      <PublicHeader />

      {/* Hero */}
      <section className="relative py-20 overflow-hidden border-b border-slate-900 text-center space-y-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-brand-600/10 via-transparent to-transparent blur-3xl pointer-events-none" />
        <Badge variant="green">Degustação Gratuita</Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Planos Claros e Sem Pegadinhas
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
          Comece a usar agora com 14 dias de trial gratuito. Cancele ou altere de plano a qualquer momento.
        </p>
      </section>

      {/* Tabela de Planos (Cards) */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`rounded-2xl bg-slate-900 p-8 border transition-all flex flex-col justify-between space-y-6 relative ${
                p.popular
                  ? 'border-2 border-brand-500 shadow-2xl ring-4 ring-brand-500/10'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-brand-500 text-white text-[10px] font-bold uppercase tracking-wider">
                  Recomendado ⭐
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{p.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{p.description}</p>
                </div>

                <div>
                  <span className="text-4xl font-extrabold text-white font-mono">{p.price}</span>
                  <span className="text-xs text-slate-400">/mês</span>
                </div>

                <div className="space-y-2 pt-4 border-t border-slate-800 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Limite de usuários:</span>
                    <strong className="text-white">{p.maxUsers}</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Limite de contatos:</span>
                    <strong className="text-white">{p.maxContacts}</strong>
                  </div>
                </div>
              </div>

              <Link href={p.ctaHref}>
                <Button
                  variant={p.popular ? 'primary' : 'outline'}
                  className={`w-full py-3 ${!p.popular ? 'border-slate-750 text-slate-200 hover:bg-slate-800' : ''}`}
                  rightIcon={<ArrowRight size={16} />}
                >
                  Testar 14 Dias Grátis
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Comparação Detalhada */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-2xl font-bold text-white">Comparativo Detalhado de Funcionalidades</h2>
          <p className="text-xs text-slate-400">Analise os recursos de cada versão para tomar a melhor decisão para seu negócio.</p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900 h-12 text-slate-300">
                <th className="px-6 font-semibold">Funcionalidade</th>
                <th className="px-4 font-semibold text-center w-28">Starter</th>
                <th className="px-4 font-semibold text-center w-28 text-brand-400">Professional</th>
                <th className="px-4 font-semibold text-center w-28">Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {featuresComparison.map((f, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40 h-12">
                  <td className="px-6 font-medium text-slate-200">{f.name}</td>
                  <td className="px-4 text-center text-slate-300 font-mono">
                    {typeof f.starter === 'boolean' ? (
                      f.starter ? <Check size={16} className="text-emerald-400 mx-auto" /> : <X size={16} className="text-slate-600 mx-auto" />
                    ) : (
                      f.starter
                    )}
                  </td>
                  <td className="px-4 text-center text-brand-300 font-semibold font-mono">
                    {typeof f.professional === 'boolean' ? (
                      f.professional ? <Check size={16} className="text-emerald-400 mx-auto" /> : <X size={16} className="text-slate-600 mx-auto" />
                    ) : (
                      f.professional
                    )}
                  </td>
                  <td className="px-4 text-center text-slate-300 font-mono">
                    {typeof f.enterprise === 'boolean' ? (
                      f.enterprise ? <Check size={16} className="text-emerald-400 mx-auto" /> : <X size={16} className="text-slate-600 mx-auto" />
                    ) : (
                      f.enterprise
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
