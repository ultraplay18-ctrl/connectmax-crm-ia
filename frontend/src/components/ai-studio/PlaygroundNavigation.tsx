'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MessageSquare,
  FileCode,
  Wrench,
  BookOpen,
  Brain,
  Cpu,
  BarChart3,
  Settings,
} from 'lucide-react';

export const PlaygroundNavigation: React.FC = () => {
  const pathname = usePathname();

  const navTabs = [
    { label: 'Chat Teste', href: '/ai-studio/playground', icon: MessageSquare },
    { label: 'Prompt Editor', href: '/ai-studio/playground/prompt', icon: FileCode },
    { label: 'Ferramentas', href: '/ai-studio/playground/tools', icon: Wrench },
    { label: 'Knowledge', href: '/ai-studio/playground/knowledge', icon: BookOpen },
    { label: 'Memory', href: '/ai-studio/playground/memory', icon: Brain },
    { label: 'Modelo & Provider', href: '/ai-studio/playground/model', icon: Cpu },
    { label: 'Analytics', href: '/ai-studio/playground/analytics', icon: BarChart3 },
    { label: 'Configurações', href: '/ai-studio/playground/settings', icon: Settings },
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
                  ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20'
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
