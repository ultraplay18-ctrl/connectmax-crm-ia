'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Cpu,
  GitMerge,
  Layers,
  Gauge,
  ShieldCheck,
  Key,
} from 'lucide-react';

export const ProvidersNavigation: React.FC = () => {
  const pathname = usePathname();

  const navTabs = [
    { label: 'Provedores IA', href: '/ai-studio/providers', icon: Cpu },
    { label: 'Cadeia de Fallback', href: '/ai-studio/providers/fallback', icon: GitMerge },
    { label: 'Modelos Habilitados', href: '/ai-studio/providers/models', icon: Layers },
    { label: 'Limites & Custos', href: '/ai-studio/providers/limits', icon: Gauge },
    { label: 'Auditoria de Segurança', href: '/ai-studio/providers/audit', icon: ShieldCheck },
    { label: 'Cofre (Secrets)', href: '/ai-studio/secrets', icon: Key },
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
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
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
