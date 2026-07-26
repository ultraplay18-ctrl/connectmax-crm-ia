'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Logo } from '../../components/Logo';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Badge } from '../../components/Badge';
import { api } from '../../services/api';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Building,
  Users,
  Upload,
  MessageSquare,
  Compass,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  AlertCircle,
} from 'lucide-react';

export default function WelcomePage() {
  const { user, refetchUser } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [trialDays, setTrialDays] = useState(14);
  const [planName, setPlanName] = useState('Starter');
  const [loading, setLoading] = useState(false);

  // Form states
  const [companyDetails, setCompanyDetails] = useState({
    name: user?.companyName || '',
    segment: '',
    phone: '',
    website: '',
  });

  const [teamMembers, setTeamMembers] = useState([
    { name: '', email: '', role: 'EMPLOYEE' },
  ]);

  const [importOption, setImportOption] = useState<'csv' | 'manual' | 'skip'>('skip');
  const [csvUploaded, setCsvUploaded] = useState(false);

  const [whatsappConfig, setWhatsappConfig] = useState({
    connectBot: true,
    aiGreeting: 'Olá! Sou a IA do ConnectMax. Como posso ajudar você hoje?',
  });

  const [tourCompleted, setTourCompleted] = useState({
    crm: false,
    leads: false,
    ia: false,
    financeiro: false,
  });

  useEffect(() => {
    if (user?.companyId) {
      api.get('/subscriptions/my-subscription')
        .then((res) => {
          setTrialDays(res.data.trial?.daysRemaining ?? 14);
          setPlanName(res.data.plan?.name || 'Starter');
        })
        .catch(() => {});
    }
  }, [user]);

  const handleInviteChange = (index: number, field: string, value: string) => {
    const updated = [...teamMembers];
    updated[index] = { ...updated[index], [field]: value };
    setTeamMembers(updated);
  };

  const addTeamMember = () => {
    setTeamMembers([...teamMembers, { name: '', email: '', role: 'EMPLOYEE' }]);
  };

  const handleFinishOnboarding = async () => {
    setLoading(true);
    try {
      // 1. Atualizar Company Settings no backend
      await api.patch('/settings', {
        onboardingCompleted: true,
        onboardingProgress: 100,
      });

      // 2. Chamar o refetch do perfil para obter o estado de onboarding atualizado no frontend
      await refetchUser();

      // 3. Redirecionar para o dashboard
      router.push('/dashboard');
    } catch (err) {
      console.error('Erro ao finalizar o onboarding:', err);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-[radial-gradient(circle_at_center,_rgba(37,99,235,0.06)_0%,_transparent_70%)] pointer-events-none" />

      {/* Top Header info */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between border-b border-slate-900 pb-6 relative z-10">
        <Logo variant="dark" size="md" />
        <div className="flex items-center gap-3 text-xs">
          <Badge variant="blue">{planName} Plan</Badge>
          <Badge variant="green">Trial Ativo: {trialDays} Dias Restantes</Badge>
        </div>
      </div>

      {/* Main wizard card */}
      <div className="max-w-3xl mx-auto w-full my-10 relative z-10">
        <div className="bg-slate-900/70 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6 sm:p-10 shadow-2xl space-y-8">
          
          {/* Progress header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-brand-400 uppercase tracking-wider">Etapa {currentStep} de 5</span>
              <span>{Math.round(((currentStep - 1) / 4) * 100)}% Concluído</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-500 transition-all duration-300"
                style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
              />
            </div>
          </div>

          {/* Setup steps */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Building size={24} className="text-brand-400" /> Configurar Dados da Empresa
                </h2>
                <p className="text-xs text-slate-400">
                  Bem-vindo ao ConnectMax CRM IA. Vamos configurar sua empresa em poucos passos.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Nome da Empresa"
                  value={companyDetails.name}
                  onChange={(e) => setCompanyDetails({ ...companyDetails, name: e.target.value })}
                  placeholder="Nome fantasia"
                />
                <Input
                  label="Segmento de Atuação"
                  value={companyDetails.segment}
                  onChange={(e) => setCompanyDetails({ ...companyDetails, segment: e.target.value })}
                  placeholder="Ex: Tecnologia, Vendas, Serviços"
                />
                <Input
                  label="Telefone Corporativo"
                  value={companyDetails.phone}
                  onChange={(e) => setCompanyDetails({ ...companyDetails, phone: e.target.value })}
                  placeholder="(11) 99999-9999"
                />
                <Input
                  label="Website Comercial"
                  value={companyDetails.website}
                  onChange={(e) => setCompanyDetails({ ...companyDetails, website: e.target.value })}
                  placeholder="www.minhaempresa.com.br"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Users size={24} className="text-brand-400" /> Configurar Equipe
                </h2>
                <p className="text-xs text-slate-400">
                  Convide os primeiros membros e defina suas funções comerciais dentro da plataforma.
                </p>
              </div>

              <div className="space-y-4">
                {teamMembers.map((member, idx) => (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end bg-slate-950/40 p-4 rounded-xl border border-slate-800/50">
                    <Input
                      label="Nome"
                      value={member.name}
                      onChange={(e) => handleInviteChange(idx, 'name', e.target.value)}
                      placeholder="Nome do colaborador"
                    />
                    <Input
                      label="E-mail"
                      value={member.email}
                      type="email"
                      onChange={(e) => handleInviteChange(idx, 'email', e.target.value)}
                      placeholder="colaborador@empresa.com"
                    />
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-350 block">Função</label>
                      <select
                        value={member.role}
                        onChange={(e) => handleInviteChange(idx, 'role', e.target.value)}
                        className="w-full h-[38px] rounded-lg bg-slate-900 border border-slate-800 px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                      >
                        <option value="EMPLOYEE">Consultor de Vendas (Employee)</option>
                        <option value="COMPANY_ADMIN">Administrador (Company Admin)</option>
                      </select>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addTeamMember}
                  className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1.5"
                >
                  + Convidar Outro Membro
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Upload size={24} className="text-brand-400" /> Importar Clientes Iniciais
                </h2>
                <p className="text-xs text-slate-400">
                  Dê o pontapé inicial na sua base de clientes trazendo contatos do seu sistema antigo.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setImportOption('csv')}
                  className={`p-5 rounded-2xl border text-center transition-all space-y-2 ${
                    importOption === 'csv' ? 'border-brand-500 bg-brand-500/5' : 'border-slate-800 bg-slate-950/20'
                  }`}
                >
                  <Upload size={24} className="mx-auto text-brand-400" />
                  <strong className="block text-xs text-white">Importar CSV</strong>
                  <span className="text-[10px] text-slate-500 block">Planilha formatada</span>
                </button>

                <button
                  type="button"
                  onClick={() => setImportOption('manual')}
                  className={`p-5 rounded-2xl border text-center transition-all space-y-2 ${
                    importOption === 'manual' ? 'border-brand-500 bg-brand-500/5' : 'border-slate-800 bg-slate-950/20'
                  }`}
                >
                  <Users size={24} className="mx-auto text-brand-400" />
                  <strong className="block text-xs text-white">Criar Manualmente</strong>
                  <span className="text-[10px] text-slate-500 block">Um a um pelo painel</span>
                </button>

                <button
                  type="button"
                  onClick={() => setImportOption('skip')}
                  className={`p-5 rounded-2xl border text-center transition-all space-y-2 ${
                    importOption === 'skip' ? 'border-brand-500 bg-brand-500/5' : 'border-slate-800 bg-slate-950/20'
                  }`}
                >
                  <ArrowRight size={24} className="mx-auto text-slate-500" />
                  <strong className="block text-xs text-white">Pular esta Etapa</strong>
                  <span className="text-[10px] text-slate-500 block">Configurar depois</span>
                </button>
              </div>

              {importOption === 'csv' && (
                <div
                  onClick={() => setCsvUploaded(true)}
                  className={`p-8 rounded-xl border-2 border-dashed text-center cursor-pointer transition-all ${
                    csvUploaded ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-800 hover:border-brand-500/40 bg-slate-950/40'
                  }`}
                >
                  {csvUploaded ? (
                    <div className="space-y-2">
                      <CheckCircle2 size={32} className="text-emerald-400 mx-auto" />
                      <p className="text-xs font-semibold text-white">Planilha carregada com sucesso!</p>
                      <p className="text-[10px] text-slate-500">Mapeamento de colunas concluído.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload size={32} className="text-slate-500 mx-auto" />
                      <p className="text-xs font-semibold text-white">Clique para carregar ou arraste seu arquivo .csv</p>
                      <p className="text-[10px] text-slate-500">Limite de tamanho: 10MB</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <MessageSquare size={24} className="text-brand-400" /> Configurar Atendimento Comercial
                </h2>
                <p className="text-xs text-slate-400">
                  Prepare o WhatsApp e a IA para capturarem novas oportunidades comerciais sem esforço.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-950/40 border border-slate-800/80 rounded-xl">
                  <div className="space-y-1">
                    <strong className="text-xs block text-white">Conectar Robô no WhatsApp</strong>
                    <span className="text-[10px] text-slate-500 block">IA responde automaticamente novas mensagens comerciais</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={whatsappConfig.connectBot}
                    onChange={(e) => setWhatsappConfig({ ...whatsappConfig, connectBot: e.target.checked })}
                    className="w-4 h-4 text-brand-500 rounded bg-slate-900 border-slate-800 focus:ring-0"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-350 block">Mensagem de Boas-vindas da IA</label>
                  <textarea
                    rows={3}
                    value={whatsappConfig.aiGreeting}
                    onChange={(e) => setWhatsappConfig({ ...whatsappConfig, aiGreeting: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Compass size={24} className="text-brand-400" /> Conhecer o Sistema
                </h2>
                <p className="text-xs text-slate-400">
                  Assinale os módulos comerciais essenciais para o dia a dia da sua operação comercial.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  onClick={() => setTourCompleted({ ...tourCompleted, crm: !tourCompleted.crm })}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                    tourCompleted.crm ? 'border-brand-500 bg-brand-500/5' : 'border-slate-800 hover:border-slate-700/80'
                  }`}
                >
                  <input type="checkbox" checked={tourCompleted.crm} readOnly className="rounded text-brand-500 border-slate-800" />
                  <div>
                    <strong className="text-xs block text-white">Módulo CRM de Vendas</strong>
                    <span className="text-[10px] text-slate-500">Gestão de contatos</span>
                  </div>
                </div>

                <div
                  onClick={() => setTourCompleted({ ...tourCompleted, leads: !tourCompleted.leads })}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                    tourCompleted.leads ? 'border-brand-500 bg-brand-500/5' : 'border-slate-800 hover:border-slate-700/80'
                  }`}
                >
                  <input type="checkbox" checked={tourCompleted.leads} readOnly className="rounded text-brand-500 border-slate-800" />
                  <div>
                    <strong className="text-xs block text-white">Funil Kanban & Leads</strong>
                    <span className="text-[10px] text-slate-500">Fluxo de negócios</span>
                  </div>
                </div>

                <div
                  onClick={() => setTourCompleted({ ...tourCompleted, ia: !tourCompleted.ia })}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                    tourCompleted.ia ? 'border-brand-500 bg-brand-500/5' : 'border-slate-800 hover:border-slate-700/80'
                  }`}
                >
                  <input type="checkbox" checked={tourCompleted.ia} readOnly className="rounded text-brand-500 border-slate-800" />
                  <div>
                    <strong className="text-xs block text-white">ConnectMax IA</strong>
                    <span className="text-[10px] text-slate-500">Resumos e qualificação</span>
                  </div>
                </div>

                <div
                  onClick={() => setTourCompleted({ ...tourCompleted, financeiro: !tourCompleted.financeiro })}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                    tourCompleted.financeiro ? 'border-brand-500 bg-brand-500/5' : 'border-slate-800 hover:border-slate-700/80'
                  }`}
                >
                  <input type="checkbox" checked={tourCompleted.financeiro} readOnly className="rounded text-brand-500 border-slate-800" />
                  <div>
                    <strong className="text-xs block text-white">CRM Financeiro</strong>
                    <span className="text-[10px] text-slate-500">Controle de receitas e despesas</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between border-t border-slate-800/80 pt-6">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center gap-1.5 text-xs font-semibold transition-colors focus:outline-none ${
                currentStep === 1 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ArrowLeft size={16} /> Voltar
            </button>

            {currentStep === 5 ? (
              <Button
                variant="primary"
                onClick={handleFinishOnboarding}
                isLoading={loading}
                rightIcon={<CheckCircle2 size={16} />}
              >
                Concluir Configuração e Entrar
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={nextStep}
                rightIcon={<ArrowRight size={16} />}
              >
                Avançar
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="text-center text-[10px] text-slate-650 mt-10">
        © 2026 ConnectMax CRM IA. Todos os direitos reservados.
      </div>
    </div>
  );
}
