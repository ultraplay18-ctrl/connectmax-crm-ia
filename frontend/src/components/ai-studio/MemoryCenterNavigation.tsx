'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Brain,
  UserCheck,
  MessageSquare,
  FileText,
  BarChart3,
  Settings,
} from 'lucide-react';

export const MemoryCenterNavigation: React.FC = () => {
  const pathname = usePathname();

  const navTabs = [
    { label: 'Dashboard', href: '/ai-studio/memory-center', icon: LayoutDashboard },
    { label: 'Memórias (6 Tipos)', href: '/ai-studio/memory-center/memories', icon: Brain },
    { label: 'Perfis Inteligentes', href: '/ai-studio/memory-center/profiles', icon: UserCheck },
    { label: 'Conversas & Sessões', href: '/ai-studio/memory-center/conversations', icon: MessageSquare },
    { label: 'Resumos Automáticos', href: '/ai-studio/memory-center/summaries', icon: FileText },
    { label: 'Analytics', href: '/ai-studio/memory-center/analytics', icon: BarChart3 },
    { label: 'Configurações', href: '/ai-studio/memory-center/settings', icon: Settings },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-1.5 shadow-sm overflow-x-auto">
      <div className="flex items-center space-x-1 min-w-max">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
