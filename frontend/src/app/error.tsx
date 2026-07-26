'use client';

import React, { useEffect } from 'react';
import { Button } from '../components/Button';
import { Logo } from '../components/Logo';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Erro detectado na aplicação frontend:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(circle_at_center,_rgba(239,68,68,0.06)_0%,_transparent_70%)] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-6">
        <div className="flex justify-center">
          <Logo variant="dark" size="lg" />
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-8 shadow-2xl space-y-6 backdrop-blur-md">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle size={36} />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-white">Oops, algo deu errado!</h2>
            <p className="text-xs text-slate-400">
              Ocorreu um erro inesperado ao carregar esta tela. Mas não se preocupe, nossos servidores já registraram o incidente.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button variant="primary" className="w-full py-3.5" onClick={() => reset()} rightIcon={<RefreshCw size={16} />}>
              Tentar Novamente
            </Button>
            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full border-slate-700 hover:bg-slate-800">
                Voltar à Página Inicial
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
