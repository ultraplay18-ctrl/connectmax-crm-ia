'use client';

import React, { useState } from 'react';
import { Logo } from '../../components/Logo';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import {
  TrendingUp,
  Users,
  Target,
  MessageSquare,
  Sparkles,
  DollarSign,
  BarChart3,
  Building2,
  CheckCircle2,
  Phone,
  User,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'crm' | 'kanban' | 'whatsapp' | 'ia' | 'financeiro' | 'relatorios'>('dashboard');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);

  const handleSimulateAi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt) return;
    setLoadingAi(true);
    setTimeout(() => {
      setAiResponse(
        `🤖 **ConnectMax IA Assistente**: Analisei a base de contatos solicitada. Com base na atividade recente, o cliente **Inova Tech** possui 92% de probabilidade de conversão nas próximas 48 horas devido a interações de WhatsApp positivas (Score: HOT). Recomendo enviar a minuta contratual hoje.`
      );
      setLoadingAi(false);
    }, 1200);
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <Building2 size={16} /> },
    { id: 'crm', label: 'Clientes', icon: <Users size={16} /> },
    { id: 'kanban', label: 'Pipeline Kanban', icon: <Target size={16} /> },
    { id: 'whatsapp', label: 'WhatsApp IA', icon: <MessageSquare size={16} /> },
    { id: 'ia', label: 'Assistente IA', icon: <Sparkles size={16} /> },
    { id: 'financeiro', label: 'Financeiro', icon: <DollarSign size={16} /> },
    { id: 'relatorios', label: 'Relatórios', icon: <BarChart3 size={16} /> },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      
      {/* Top Demo Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo variant="dark" size="md" />
            <Badge variant="blue">Demonstração Visual</Badge>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/">
              <span className="text-xs text-slate-400 hover:text-white cursor-pointer transition-colors">Voltar ao site</span>
            </Link>
            <Link href="/register?plan=Professional">
              <span>
                <Button variant="primary" size="sm" rightIcon={<ChevronRight size={14} />}>
                  Iniciar Teste de 14 Dias
                </Button>
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-1 space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Módulos do Sistema</h3>
            <nav className="flex flex-col gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-all ${
                    activeTab === tab.id
                      ? 'bg-brand-500 text-white shadow-md shadow-brand-500/10'
                      : 'text-slate-400 hover:bg-slate-850 hover:text-white'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 text-[11px] text-slate-400 space-y-2.5">
            <div className="flex items-center gap-1.5 text-brand-400 font-bold">
              <ShieldCheck size={16} />
              <span>Dica de Navegação</span>
            </div>
            <p className="leading-relaxed">
              Explore cada módulo à esquerda para simular as principais funcionalidades do CRM. Esta é uma versão demonstrativa interativa pré-carregada com dados de teste.
            </p>
          </div>
        </aside>

        {/* Content Viewer */}
        <section className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-6 min-h-[460px] flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-[100px] pointer-events-none" />

          {/* TAB: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">Painel de Controle Executivo</h2>
                <p className="text-xs text-slate-400">Consolidado comercial em tempo real da sua empresa.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-950/40 border border-slate-850/80 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Previsão Comercial</span>
                  <div className="text-lg font-bold text-white font-mono">R$ 148.500,00</div>
                  <Badge variant="green">+14% este mês</Badge>
                </div>
                <div className="p-4 bg-slate-950/40 border border-slate-850/80 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Leads Ativos</span>
                  <div className="text-lg font-bold text-white font-mono">342</div>
                  <Badge variant="blue">Cota Comercial OK</Badge>
                </div>
                <div className="p-4 bg-slate-950/40 border border-slate-850/80 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Automações da IA</span>
                  <div className="text-lg font-bold text-white font-mono">1.240 ops</div>
                  <Badge variant="green">Robô Ativo 🤖</Badge>
                </div>
              </div>

              {/* Simulated Chart */}
              <div className="p-5 bg-slate-950/40 border border-slate-850/85 rounded-xl space-y-4">
                <span className="text-xs font-bold text-slate-350 block">Desempenho de Vendas Mensal</span>
                <div className="h-32 flex items-end gap-3.5 pt-4">
                  <div className="w-full bg-slate-850 h-[30%] rounded-t-md relative group"><div className="absolute bottom-full left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded shadow mb-1 hidden group-hover:block">R$ 30k</div></div>
                  <div className="w-full bg-slate-850 h-[45%] rounded-t-md relative group"><div className="absolute bottom-full left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded shadow mb-1 hidden group-hover:block">R$ 45k</div></div>
                  <div className="w-full bg-slate-850 h-[60%] rounded-t-md relative group"><div className="absolute bottom-full left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded shadow mb-1 hidden group-hover:block">R$ 60k</div></div>
                  <div className="w-full bg-brand-500 h-[85%] rounded-t-md relative group"><div className="absolute bottom-full left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded shadow mb-1 hidden group-hover:block">R$ 85k</div></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>Março</span>
                  <span>Abril</span>
                  <span>Maio</span>
                  <span>Junho (Atual)</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB: CRM CLIENTES */}
          {activeTab === 'crm' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white">Base de Clientes Unificada</h2>
                <p className="text-xs text-slate-400">Contatos e empresas integrados ao CRM.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-950/40 border-b border-slate-850 text-slate-400 font-semibold uppercase tracking-wider">
                      <th className="p-3">Cliente</th>
                      <th className="p-3">E-mail</th>
                      <th className="p-3">Telefone</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    <tr className="hover:bg-slate-850/40">
                      <td className="p-3 font-bold text-white">Grupo Inova Tech</td>
                      <td className="p-3 text-slate-350">contato@inovatech.com</td>
                      <td className="p-3 font-mono text-slate-350">(11) 98888-7777</td>
                      <td className="p-3"><Badge variant="green">Ativo</Badge></td>
                    </tr>
                    <tr className="hover:bg-slate-850/40">
                      <td className="p-3 font-bold text-white">Soluções Alfa Ltda</td>
                      <td className="p-3 text-slate-350">adm@solucoesalfa.com</td>
                      <td className="p-3 font-mono text-slate-350">(21) 97777-6666</td>
                      <td className="p-3"><Badge variant="blue">Lead</Badge></td>
                    </tr>
                    <tr className="hover:bg-slate-850/40">
                      <td className="p-3 font-bold text-white">Nexus Enterprise S.A.</td>
                      <td className="p-3 text-slate-350">vendas@nexus.com</td>
                      <td className="p-3 font-mono text-slate-350">(19) 96666-5555</td>
                      <td className="p-3"><Badge variant="green">Ativo</Badge></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: KANBAN */}
          {activeTab === 'kanban' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white">Pipeline Kanban Comercial</h2>
                <p className="text-xs text-slate-400">Arraste e acompanhe oportunidades de venda.</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {/* Coluna 1 */}
                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-850 space-y-3">
                  <div className="flex items-center justify-between text-xs border-b border-slate-850 pb-2">
                    <span className="font-bold text-white">Novo Lead</span>
                    <Badge variant="slate">1</Badge>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-850 border border-slate-800 space-y-2">
                    <strong className="block text-xs text-white">Licença Antivirus</strong>
                    <span className="text-[10px] text-slate-400 block">Empresa Alfa • R$ 3.500</span>
                  </div>
                </div>

                {/* Coluna 2 */}
                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-850 space-y-3">
                  <div className="flex items-center justify-between text-xs border-b border-slate-850 pb-2">
                    <span className="font-bold text-white">Proposta Enviada</span>
                    <Badge variant="blue">1</Badge>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-850 border border-slate-800 space-y-2">
                    <strong className="block text-xs text-white">Desenvolvimento App</strong>
                    <span className="text-[10px] text-slate-400 block">Inova Tech • R$ 28.000</span>
                  </div>
                </div>

                {/* Coluna 3 */}
                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-850 space-y-3">
                  <div className="flex items-center justify-between text-xs border-b border-slate-850 pb-2">
                    <span className="font-bold text-white">Ganho ⭐</span>
                    <Badge variant="green">1</Badge>
                  </div>
                  <div className="p-3 rounded-lg bg-brand-500/10 border border-brand-500/20 space-y-2">
                    <strong className="block text-xs text-brand-400">Mentoria Comercial</strong>
                    <span className="text-[10px] text-brand-300/80 block">Nexus Tech • R$ 15.000</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: WHATSAPP IA */}
          {activeTab === 'whatsapp' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white">Integração do Chat e WhatsApp IA</h2>
                <p className="text-xs text-slate-400">Atendimento inteligente automatizado com transbordo humano.</p>
              </div>

              <div className="border border-slate-850 rounded-xl bg-slate-950/40 overflow-hidden flex flex-col h-64 justify-between">
                {/* Chat Message Window */}
                <div className="p-4 space-y-3.5 overflow-y-auto text-[11px]">
                  <div className="flex justify-start">
                    <div className="bg-slate-850 text-white rounded-2xl px-4 py-2 max-w-[80%]">
                      Olá, gostaria de saber se vocês têm planos comerciais para mais de 10 usuários.
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-brand-500 text-white rounded-2xl px-4 py-2 max-w-[80%]">
                      🤖 **Bot IA**: Olá! Temos sim. O plano Professional suporta até 10 usuários e o plano Enterprise possui limite ilimitado. Deseja que eu agende uma reunião para você?
                    </div>
                  </div>
                </div>

                {/* Message Input bar */}
                <div className="p-3 bg-slate-900 border-t border-slate-850 flex gap-2">
                  <input
                    type="text"
                    disabled
                    placeholder="O robô inteligente de WhatsApp está respondendo..."
                    className="flex-grow bg-slate-950 border border-slate-800 rounded-lg px-3.5 text-xs text-slate-400 focus:outline-none"
                  />
                  <Badge variant="green">Conectado 🟢</Badge>
                </div>
              </div>
            </div>
          )}

          {/* TAB: ASSISTENTE IA */}
          {activeTab === 'ia' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white">Assistente IA RAG Avançado</h2>
                <p className="text-xs text-slate-400">Qualifique oportunidades de venda e gere resumos executivos.</p>
              </div>

              <form onSubmit={handleSimulateAi} className="space-y-4">
                <textarea
                  rows={2}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Escreva sua instrução para a IA (Ex: Qualifique o lead da Inova Tech...)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
                <Button variant="primary" type="submit" isLoading={loadingAi} rightIcon={<Sparkles size={16} />}>
                  Executar Prompt de IA
                </Button>
              </form>

              {aiResponse && (
                <div className="p-4 bg-brand-500/10 border border-brand-500/20 text-xs text-brand-300 rounded-xl leading-relaxed whitespace-pre-line">
                  {aiResponse}
                </div>
              )}
            </div>
          )}

          {/* TAB: FINANCEIRO */}
          {activeTab === 'financeiro' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white font-sans">CRM Financeiro e Contas</h2>
                <p className="text-xs text-slate-400">Previsões de contas a pagar e receber do funil comercial.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950/20 border border-slate-850 rounded-xl space-y-3">
                  <strong className="text-xs text-emerald-400 block font-semibold">Contas a Receber (Negócios Ganhos)</strong>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-350">
                      <span>Inova Tech app</span>
                      <strong className="font-mono text-white">R$ 28.000,00</strong>
                    </div>
                    <div className="flex justify-between text-slate-350">
                      <span>Nexus Mentoria</span>
                      <strong className="font-mono text-white">R$ 15.000,00</strong>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-950/20 border border-slate-850 rounded-xl space-y-3">
                  <strong className="text-xs text-rose-400 block font-semibold">Contas a Pagar (Infraestrutura)</strong>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-350">
                      <span>Servidores AWS</span>
                      <strong className="font-mono text-white">R$ 1.850,00</strong>
                    </div>
                    <div className="flex justify-between text-slate-350">
                      <span>API Meta WhatsApp</span>
                      <strong className="font-mono text-white">R$ 450,00</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: RELATORIOS */}
          {activeTab === 'relatorios' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white">Relatórios & Conversão</h2>
                <p className="text-xs text-slate-400">Métricas analíticas de desempenho do SaaS.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="p-5 bg-slate-950/40 border border-slate-850 rounded-xl flex flex-col justify-between space-y-4">
                  <strong className="text-xs text-white block">Conversão por Canal</strong>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>WhatsApp Bot</span>
                      <strong className="text-emerald-400">64%</strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Formulário de Leads</span>
                      <strong className="text-emerald-400">22%</strong>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-slate-950/40 border border-slate-850 rounded-xl flex flex-col justify-between space-y-4">
                  <strong className="text-xs text-white block">Tempo Médio de Atendimento</strong>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Resposta com IA</span>
                      <strong className="text-brand-400">2 segundos</strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Transbordo Humano</span>
                      <strong className="text-slate-200">4.5 minutos</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer actions inside simulator */}
          <div className="mt-8 pt-4 border-t border-slate-850 flex items-center justify-between text-xs text-slate-400">
            <span>ConnectMax CRM IA Demo 2.0</span>
            <Link href="/register?plan=Professional">
              <span className="text-brand-400 hover:underline cursor-pointer flex items-center gap-1 font-bold">
                Ativar período de Trial de 14 Dias <ChevronRight size={14} />
              </span>
            </Link>
          </div>
        </section>
      </main>

      {/* Demo Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        © 2026 ConnectMax CRM IA. Apresentação corporativa de alta conversão.
      </footer>
    </div>
  );
}
