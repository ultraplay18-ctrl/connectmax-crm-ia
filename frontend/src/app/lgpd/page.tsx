'use client';

import React from 'react';
import { Badge } from '../../components/Badge';
import { PublicHeader } from '../../components/PublicHeader';
import { PublicFooter } from '../../components/PublicFooter';

export default function LgpdPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-brand-500 selection:text-white">
      <PublicHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-32 space-y-8 flex-grow">
        <div className="space-y-3 text-center sm:text-left">
          <Badge variant="blue">Conformidade</Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Conformidade LGPD</h1>
          <p className="text-xs text-slate-400">Declaração de Conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018)</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-slate-350 leading-relaxed">
          <p>
            O **ConnectMax CRM IA** assume o compromisso de respeitar a privacidade e proteger os dados pessoais de seus clientes, usuários e parceiros em conformidade com as diretrizes e regras da **LGPD**.
          </p>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">Como Agimos como Operador de Dados</h2>
            <p>
              Ao utilizar o CRM para gerenciar contatos, leads e conversas de WhatsApp, o cliente atua como **Controlador de Dados** e o ConnectMax atua como **Operador**. Processamos os dados estritamente para fornecer as funcionalidades contratadas (ex: qualificação de leads por IA, kanban e relatórios).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">Nossos Pilares de Conformidade</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>**Isolamento Estrito**: Cada Tenant possui uma chave única que impede vazamento ou mistura de dados.</li>
              <li>**Logs de Auditoria**: Qualquer alteração de status, cadastros ou exclusões geram logs de auditoria detalhados no painel do administrador.</li>
              <li>**Criptografia**: Toda a comunicação é trafegada de forma segura por meio do protocolo HTTPS/TLS.</li>
            </ul>
          </section>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
