'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from '../../../components/Logo';
import { Button } from '../../../components/Button';
import { CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.08)_0%,_transparent_70%)] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-6">
        <div className="flex justify-center">
          <Logo variant="dark" size="lg" />
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-8 shadow-2xl space-y-6 backdrop-blur-md">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={36} />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-white">Assinatura Ativada! 🎉</h2>
            <p className="text-xs text-slate-400">
              Obrigado por escolher o ConnectMax CRM IA. O pagamento foi processado e todas as funcionalidades do seu plano já estão liberadas.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/40 p-3.5 rounded-xl border border-slate-850/80 text-[11px] text-slate-400 text-left">
            <ShieldCheck size={18} className="text-brand-400 shrink-0 mt-0.5" />
            <span>Nossos servidores já configuraram o ambiente multi-tenant isolado para a sua empresa de forma segura.</span>
          </div>

          <Link href="/dashboard" className="w-full block">
            <Button variant="primary" className="w-full py-3.5" rightIcon={<ArrowRight size={16} />}>
              Acessar Meu Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
