'use client';

import React from 'react';
import { Logo } from '../../components/Logo';
import { Badge } from '../../components/Badge';
import { PublicHeader } from '../../components/PublicHeader';
import { PublicFooter } from '../../components/PublicFooter';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-brand-500 selection:text-white">
      <PublicHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-32 space-y-8 flex-grow">
        <div className="space-y-3 text-center sm:text-left">
          <Badge variant="blue">Documento Legal</Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Termos de Uso</h1>
          <p className="text-xs text-slate-400">Última atualização: 22 de Julho de 2026</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-slate-350 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">1. Aceitação dos Termos</h2>
            <p>
              Ao se cadastrar e utilizar o **ConnectMax CRM IA**, você concorda integralmente com estes Termos de Uso. Caso não concorde com qualquer disposição, você não deve utilizar a plataforma.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">2. Cadastro de Contas e Uso do Sistema</h2>
            <p>
              O ConnectMax CRM IA é comercializado sob o modelo de Software como Serviço (SaaS) Multi-Tenant. Cada empresa contratante (Tenant) possui um ambiente lógico isolado. É de responsabilidade única do cliente:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Manter a confidencialidade das credenciais de acesso de toda a sua equipe.</li>
              <li>Garantir a veracidade dos dados corporativos e do CNPJ preenchidos durante o registro.</li>
              <li>Não utilizar a plataforma para atividades ilícitas ou envio de mensagens indesejadas (SPAM) via WhatsApp.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">3. Período de Degustação (Trial) e Assinaturas</h2>
            <p>
              Oferecemos um período de degustação gratuita de 14 dias para avaliação dos recursos. Após este prazo, para manter o ambiente ativo, o cliente deverá selecionar um plano comercial (Starter, Professional ou Enterprise) e realizar o pagamento correspondente. O cancelamento pode ser efetuado a qualquer momento sem taxas rescisórias.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">4. Limitação de Responsabilidade</h2>
            <p>
              O ConnectMax CRM IA e suas integrações (incluindo IA e API Meta WhatsApp) são fornecidos "como estão". Não nos responsabilizamos por perdas comerciais decorrentes de instabilidades temporárias de serviços de terceiros ou má configuração dos atendimentos por IA.
            </p>
          </section>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
