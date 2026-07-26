'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '../components/Logo';
import {
  LayoutDashboard,
  Sparkles,
  Bot,
  MessageCircle,
  Target,
  Users,
  CheckSquare,
  Calendar,
  DollarSign,
  CreditCard,
  User,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Building,
  BookOpen,
  Brain,
  FlaskConical,
  Cpu,
  Key,
  X,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'AI Studio', href: '/ai-studio', icon: Bot },
    { label: 'AI Playground', href: '/ai-studio/playground', icon: FlaskConical },
    { label: 'Providers IA', href: '/ai-studio/providers', icon: Cpu },
    { label: 'Cofre (Secrets)', href: '/ai-studio/secrets', icon: Key },
    { label: 'Knowledge Hub', href: '/ai-studio/knowledge-hub', icon: BookOpen },
    { label: 'Memory Center', href: '/ai-studio/memory-center', icon: Brain },
    { label: 'Assistente IA', href: '/ai-assistant', icon: Sparkles },
    { label: 'WhatsApp & IA', href: '/whatsapp', icon: MessageCircle },
    { label: 'Funil de Vendas', href: '/leads', icon: Target },
    { label: 'Clientes & Contatos', href: '/contacts', icon: Users },
    { label: 'Tarefas & Interações', href: '/activities', icon: CheckSquare },
    { label: 'Agenda & Reuniões', href: '/calendar', icon: Calendar },
    { label: 'Financeiro', href: '/financial', icon: DollarSign },
    { label: 'Assinatura & Planos', href: '/billing', icon: CreditCard },
    { label: 'Perfil', href: '/profile', icon: User },
    { label: 'Configurações', href: '/settings', icon: Settings },
  ];

  if (user?.role === 'SUPER_ADMIN' || user?.role === 'COMPANY_ADMIN') {
    navItems.push({ label: 'Logs de Auditoria', href: '/audit-logs', icon: ShieldAlert });
  }

  const superAdminNav = [
    { label: 'Super Admin Painel', href: '/admin', icon: ShieldCheck },
    { label: 'Gestão de Empresas', href: '/admin/companies', icon: Building },
    { label: 'Assinaturas Globais', href: '/admin/subscriptions', icon: CreditCard },
    { label: 'Auditoria Global', href: '/admin/audit-logs', icon: ShieldAlert },
  ];

  return (
    <>
      {/* Backdrop Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-slate-900 text-white border-r border-slate-800 transition-transform duration-300 ease-in-out overflow-y-auto lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
          <Logo variant="dark" size="md" />
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-4 px-4 space-y-1.5 pb-20">
          {user?.role === 'SUPER_ADMIN' && (
            <div className="mb-4 pb-3 border-b border-slate-800 space-y-1">
              <p className="px-3 text-[10px] font-bold tracking-wider text-brand-400 uppercase flex items-center gap-1">
                <ShieldCheck size={12} /> Painel Super Admin 🛡️
              </p>
              {superAdminNav.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                        : 'text-emerald-400 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    <Icon size={16} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          )}

          <p className="px-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
            Menu Principal
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-500 text-white font-semibold shadow-md shadow-brand-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 bg-slate-900 border-t border-slate-800 text-xs text-slate-500">
          <div className="flex items-center justify-between">
            <span>Versão</span>
            <span className="font-mono text-brand-400">v1.0.0 SaaS</span>
          </div>
        </div>
      </aside>
    </>
  );
};
