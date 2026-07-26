'use client';

import React from 'react';
import { Badge } from '../../components/Badge';
import { PublicHeader } from '../../components/PublicHeader';
import { PublicFooter } from '../../components/PublicFooter';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-brand-500 selection:text-white">
      <PublicHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-32 space-y-8 flex-grow">
        <div className="space-y-3 text-center sm:text-left">
          <Badge variant="blue">Privacidade</Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Política de Privacidade</h1>
          <p className="text-xs text-slate-400">Última atualização: 22 de Julho de 2026</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-slate-350 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">1. Informações Coletadas</h2>
            <p>
              Coletamos dados necessários para a operação comercial do SaaS:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>**Dados cadastrais**: Nome do usuário, e-mail, telefone, nome da empresa e CNPJ.</li>
              <li>**Integrações**: Mensagens enviadas e recebidas por meio da integração do WhatsApp para fins de processamento pela IA comercial do tenant.</li>
              <li>**Dados de Faturamento**: Histórico de pagamentos, referências de faturas Stripe/Mercado Pago.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">2. Segurança e Isolamento de Dados</h2>
            <p>
              Empregamos protocolos de criptografia em trânsito e em repouso. O ConnectMax CRM IA opera sob arquitetura de multi-tenancy, o que garante que nenhum funcionário ou processo de outra empresa cliente possa acessar ou ler seus contatos, mensagens ou relatórios financeiros.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">3. Direitos dos Titulares de Dados</h2>
            <p>
              Em conformidade com legislações de proteção de dados, garantimos aos nossos clientes e seus respectivos usuários o direito de acessar, retificar, exportar ou solicitar a exclusão de seus dados pessoais do sistema a qualquer momento pelo e-mail oficial de suporte: **suporte@connectmaxcrm.com**.
            </p>
          </section>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
