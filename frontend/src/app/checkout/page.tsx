'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { Logo } from '../../components/Logo';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { api } from '../../services/api';
import {
  CreditCard,
  Building2,
  CheckCircle,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  FileText,
} from 'lucide-react';

function CheckoutForm() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const planId = searchParams.get('planId');
  const sessionId = searchParams.get('sessionId');

  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (planId) {
      api.get('/subscriptions/plans')
        .then((res) => {
          const plan = res.data.find((p: any) => p.id === planId);
          setSelectedPlan(plan);
        })
        .catch(() => {});
    }
  }, [planId]);

  const handleConfirmSubscription = async () => {
    setLoading(true);
    try {
      // Simula o webhook de pagamento aprovado enviado pelo gateway externo
      await api.post('/webhooks/payment', {
        event: 'payment.approved',
        companyId: user?.companyId,
        planId: selectedPlan.id,
        externalSubscriptionId: `ext_sub_${Math.random().toString(36).substring(7)}`,
      });

      setSuccess(true);
      setTimeout(() => {
        router.push('/billing');
      }, 2000);
    } catch (err) {
      console.error('Erro ao aprovar assinatura:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
  };

  if (!selectedPlan) {
    return (
      <div className="py-24 text-center text-xs text-slate-500">Carregando detalhes do checkout comercial...</div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="bg-slate-900/60 border border-slate-800/85 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-8 backdrop-blur-md">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-5">
          <div className="flex items-center gap-2">
            <CreditCard className="text-brand-400" size={24} />
            <h2 className="text-xl font-bold">Checkout Seguro SaaS</h2>
          </div>
          <Badge variant="blue">Simulador Ativo</Badge>
        </div>

        {success ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle size={36} />
            </div>
            <h3 className="text-xl font-bold text-white">Pagamento Aprovado com Sucesso!</h3>
            <p className="text-xs text-slate-400">
              Sua conta foi ativada. Redirecionando para a área de faturamento...
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Resumo do Plano */}
            <div className="p-5 rounded-xl bg-slate-950/40 border border-slate-850/80 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Plano Selecionado</h3>
                  <strong className="text-lg text-white font-bold">{selectedPlan.name}</strong>
                </div>
                <Badge variant="green">Recorrência Mensal</Badge>
              </div>
              <div className="pt-2 border-t border-slate-900 flex justify-between items-center">
                <span className="text-xs text-slate-400">Valor mensal da assinatura:</span>
                <strong className="text-xl text-brand-400 font-bold font-mono">
                  {formatCurrency(selectedPlan.price)}
                </strong>
              </div>
            </div>

            {/* Dados de Faturamento */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 size={16} /> Dados da Empresa Contratante
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/40 p-4 rounded-xl border border-slate-850/80 text-xs">
                <div>
                  <span className="text-slate-500 block">Razão Social:</span>
                  <strong className="text-slate-350">{user?.companyName || 'Sua Empresa'}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">CNPJ / ID de Cadastro:</span>
                  <strong className="text-slate-350 font-mono">{user?.companyId?.substring(0, 18)}</strong>
                </div>
              </div>
            </div>

            {/* Security disclaimer */}
            <div className="p-4 rounded-xl bg-slate-950/20 border border-slate-900 text-xs text-slate-400 flex items-start gap-2.5">
              <ShieldCheck className="text-brand-400 shrink-0 mt-0.5" size={18} />
              <p className="leading-relaxed text-[11px]">
                Ambiente de checkout de homologação. O clique no botão abaixo dispara o evento simulado do gateway para ativação instantânea no plano desejado.
              </p>
            </div>

            {/* CTA */}
            <Button
              variant="primary"
              size="lg"
              className="w-full shadow-lg shadow-brand-500/20"
              isLoading={loading}
              onClick={handleConfirmSubscription}
              rightIcon={<ArrowRight size={18} />}
            >
              Confirmar Assinatura e Ativar Conta
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background neon glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(circle_at_center,_rgba(37,99,235,0.08)_0%,_transparent_70%)] pointer-events-none" />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center mb-8 relative z-10">
        <div className="flex justify-center mb-6">
          <Logo variant="dark" size="lg" />
        </div>
      </div>

      <Suspense fallback={
        <div className="text-center py-12">
          <p className="text-sm text-slate-400">Carregando formulário de checkout...</p>
        </div>
      }>
        <CheckoutForm />
      </Suspense>
    </div>
  );
}
