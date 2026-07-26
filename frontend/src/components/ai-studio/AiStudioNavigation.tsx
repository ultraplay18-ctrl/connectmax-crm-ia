'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Bot,
  Cpu,
  BookOpen,
  Wrench,
  Play,
  FileCode,
  Settings,
} from 'lucide-react';

export const AiStudioNavigation: React.FC = () => {
  const pathname = usePathname();

  const tabs = [
    { label: 'Dashboard IA', href: '/ai-studio', icon: LayoutDashboard },
    { label: 'Agentes', href: '/ai-studio/agents', icon: Bot },
    { label: 'Modelos', href: '/ai-studio/models', icon: Cpu },
    { label: 'Base de Conhecimento', href: '/ai-studio/knowledge', icon: BookOpen },
    { label: 'Ferramentas & MCP', href: '/ai-studio/tools', icon: Wrench },
    { label: 'Execuções', href: '/ai-studio/executions', icon: Play },
    { label: 'Logs', href: '/ai-studio/logs', icon: FileCode },
    { label: 'Configurações', href: '/ai-studio/settings', icon: Settings },
  ];

  return (
    <div className="border-b border-slate-200 bg-white px-2 rounded-xl shadow-sm overflow-x-auto">
      <nav className="flex space-x-1 min-w-max">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all ${
                isActive
                  ? 'border-brand-500 text-brand-600 bg-brand-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-brand-500' : 'text-slate-400'} />
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
