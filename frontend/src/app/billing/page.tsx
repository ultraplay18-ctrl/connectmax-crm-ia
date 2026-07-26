'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { api } from '../../services/api';
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Users,
  Building,
  Zap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Download,
  XCircle,
} from 'lucide-react';

export default function BillingPage() {
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [changingPlan, setChangingPlan] = useState<string | null>(null);
  const [canceling, setCanceling] = useState(false);
  const router = useRouter();

  const fetchSubscriptionInfo = async () => {
    setLoading(true);
    try {
      const [subRes, plansRes] = await Promise.all([
        api.get('/subscriptions/my-subscription'),
        api.get('/subscriptions/plans'),
      ]);

      setSubscriptionData(subRes.data);
      setPlans(plansRes.data || []);
    } catch (err) {
      console.error('Erro ao buscar dados da assinatura:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionInfo();
  }, []);

  const handleChangePlan = async (planId: string) => {
    setChangingPlan(planId);
    try {
      // 1. Obter a sessão de checkout gerada no backend
      const response = await api.post('/subscriptions/checkout', { planId });
      const { checkoutUrl } = response.data;

      // 2. Redirecionar para o Checkout Wizard
      router.push(checkoutUrl);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao iniciar checkout.');
    } finally {
      setChangingPlan(null);
    }
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm('Tem certeza que deseja cancelar sua assinatura SaaS? Seus limites serão reduzidos.')) return;
    setCanceling(true);
    try {
      await api.post('/subscriptions/cancel');
      alert('Assinatura cancelada com sucesso.');
      fetchSubscriptionInfo();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao cancelar assinatura.');
    } finally {
      setCanceling(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="py-24 text-center text-xs text-slate-500">Carregando informações da assinatura...</div>
      </DashboardLayout>
    );
  }

  const currentPlan = subscriptionData?.plan;
  const usage = subscriptionData?.usage;
  const subStatus = subscriptionData?.subscription?.status;

  const isExpired = subStatus === 'EXPIRED';
  const isCanceled = subStatus === 'CANCELED';
  const isTrial = subscriptionData?.subscription?.isTrial;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="text-brand-500" /> Assinatura & Faturamento SaaS
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Gerencie o plano comercial da sua empresa, consulte o consumo de cotas e veja o histórico de faturas.
            </p>
          </div>
        </div>

        {/* PLANO ATUAL & CONSUMO DE COTAS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card Plano Atual */}
          <div className="bg-gradient-to-r from-brand-900 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-xl space-y-4 border border-brand-500/30 lg:col-span-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Seu Plano</span>
                {isExpired ? (
                  <Badge variant="red">Expirado 🔴</Badge>
                ) : isCanceled ? (
                  <Badge variant="amber">Cancelado ⚠️</Badge>
                ) : isTrial ? (
                  <Badge variant="blue">Período de Teste 🕒</Badge>
                ) : (
                  <Badge variant="green">Ativo 🟢</Badge>
                )}
              </div>

              <div className="mt-4 space-y-1">
                <h2 className="text-3xl font-extrabold text-white">{currentPlan?.name}</h2>
                <p className="text-2xl font-bold text-brand-400 font-mono">
                  {formatCurrency(currentPlan?.price)}{' '}
                  <span className="text-xs font-normal text-slate-300">/ mês</span>
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 text-xs space-y-2.5 text-slate-300">
              <div className="flex items-center justify-between">
                <span>{isTrial ? 'Expiração do Teste:' : 'Próxima Cobrança:'}</span>
                <strong className="font-mono text-white">
                  {new Date(subscriptionData?.subscription?.nextBillingDate || subscriptionData?.subscription?.trialEndsAt).toLocaleDateString('pt-BR')}
                </strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Gateway de Pagamento:</span>
                <span className="font-mono text-emerald-400">Simulação SaaS (Stripe/MP)</span>
              </div>
            </div>

            {!isCanceled && !isExpired && (
              <div className="pt-3 border-t border-white/10">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-red-400 border-red-500/30 hover:bg-red-500/10 text-xs py-2"
                  isLoading={canceling}
                  onClick={handleCancelSubscription}
                  leftIcon={<XCircle size={14} />}
                >
                  Cancelar Assinatura
                </Button>
              </div>
            )}
          </div>

          {/* Barras de Consumo de Cotas */}
          <Card title="Consumo de Cotas do Tenant" className="lg:col-span-2">
            <div className="space-y-6 py-2">
              {/* Cota de Usuários */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Users size={16} className="text-brand-500" /> Usuários Cadastrados
                  </span>
                  <span className="font-mono text-slate-600 font-semibold">
                    {usage?.users?.used} / {usage?.users?.max === -1 ? 'Ilimitado' : usage?.users?.max}
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200">
                  <div
                    className={`h-full rounded-full transition-all ${
                      usage?.users?.percentage >= 90
                        ? 'bg-red-500'
                        : usage?.users?.percentage >= 75
                        ? 'bg-amber-500'
                        : 'bg-brand-600'
                    }`}
                    style={{ width: `${usage?.users?.max === -1 ? 10 : usage?.users?.percentage}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  {usage?.users?.max === -1
                    ? 'Seu plano possui usuários ilimitados.'
                    : `Sua empresa utilizou ${usage?.users?.percentage}% da cota máxima de usuários.`}
                </p>
              </div>

              {/* Cota de Contatos */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Building size={16} className="text-brand-500" /> Clientes & Contatos
                  </span>
                  <span className="font-mono text-slate-600 font-semibold">
                    {usage?.contacts?.used} / {usage?.contacts?.max === -1 ? 'Ilimitado' : usage?.contacts?.max?.toLocaleString('pt-BR')}
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200">
                  <div
                    className={`h-full rounded-full transition-all ${
                      usage?.contacts?.percentage >= 90
                        ? 'bg-red-500'
                        : usage?.contacts?.percentage >= 75
                        ? 'bg-amber-500'
                        : 'bg-brand-600'
                    }`}
                    style={{ width: `${usage?.contacts?.max === -1 ? 10 : usage?.contacts?.percentage}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  {usage?.contacts?.max === -1
                    ? 'Seu plano possui limite ilimitado de contatos.'
                    : `Sua empresa utilizou ${usage?.contacts?.percentage}% da cota de contatos cadastrados.`}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* COMPARATIVO E UPGRADE DE PLANOS */}
        <div className="space-y-4">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h2 className="text-xl font-bold text-slate-900">Upgrade / Downgrade de Planos Comerciais</h2>
            <p className="text-xs text-slate-500">
              Escolha o plano ideal para a escala da sua operação comercial. Faça upgrade a qualquer momento.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((p) => {
              const isCurrent = currentPlan?.id === p.id;
              const featuresList = p.features ? JSON.parse(p.features) : [];

              return (
                <div
                  key={p.id}
                  className={`rounded-2xl bg-white p-6 border transition-all space-y-6 flex flex-col justify-between ${
                    isCurrent
                      ? 'border-2 border-brand-500 shadow-lg ring-4 ring-brand-500/10'
                      : 'border-slate-200 hover:border-brand-500/40 hover:shadow-md'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-slate-900">{p.name}</h3>
                      {isCurrent && <Badge variant="blue">Seu Plano</Badge>}
                    </div>

                    <div>
                      <span className="text-3xl font-extrabold text-slate-900 font-mono">
                        {formatCurrency(p.price)}
                      </span>
                      <span className="text-xs text-slate-400 font-normal"> / mês</span>
                    </div>

                    <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs">
                      {featuresList.map((feature: string, fIdx: number) => (
                        <div key={fIdx} className="flex items-start gap-2 text-slate-700">
                          <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    {isCurrent ? (
                      <Button variant="outline" className="w-full" disabled>
                        Plano Atual Ativo
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        className="w-full"
                        isLoading={changingPlan === p.id}
                        onClick={() => handleChangePlan(p.id)}
                        rightIcon={<ArrowRight size={16} />}
                      >
                        Trocar para {p.name}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* HISTÓRICO DE FATURAS */}
        <Card title="Histórico de Faturas da Assinatura">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="p-3">Data</th>
                  <th className="p-3">Plano</th>
                  <th className="p-3">Valor</th>
                  <th className="p-3">Forma de Pagamento</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Comprovante</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/80">
                  <td className="p-3 font-mono text-slate-600">
                    {new Date(subscriptionData?.subscription?.startDate).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="p-3 font-semibold text-slate-900">{currentPlan?.name}</td>
                  <td className="p-3 font-bold text-slate-900 font-mono">{formatCurrency(currentPlan?.price)}</td>
                  <td className="p-3 text-slate-600">Simulação SaaS (PIX / Cartão)</td>
                  <td className="p-3">
                    {isExpired ? (
                      <Badge variant="red">Inadimplente 🔴</Badge>
                    ) : (
                      <Badge variant="green">Pago 🟢</Badge>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <button className="text-brand-600 hover:text-brand-700 font-semibold inline-flex items-center gap-1">
                      <Download size={14} /> PDF
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
