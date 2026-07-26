'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Globe,
  HelpCircle,
  FolderTree,
  Tag,
  BarChart3,
  Settings,
} from 'lucide-react';

export const KnowledgeHubNavigation: React.FC = () => {
  const pathname = usePathname();

  const navTabs = [
    { label: 'Dashboard', href: '/ai-studio/knowledge-hub', icon: LayoutDashboard },
    { label: 'Bibliotecas', href: '/ai-studio/knowledge-hub/libraries', icon: FolderKanban },
    { label: 'Documentos', href: '/ai-studio/knowledge-hub/documents', icon: FileText },
    { label: 'Websites', href: '/ai-studio/knowledge-hub/websites', icon: Globe },
    { label: 'FAQ', href: '/ai-studio/knowledge-hub/faq', icon: HelpCircle },
    { label: 'Categorias', href: '/ai-studio/knowledge-hub/categories', icon: FolderTree },
    { label: 'Tags', href: '/ai-studio/knowledge-hub/tags', icon: Tag },
    { label: 'Analytics', href: '/ai-studio/knowledge-hub/analytics', icon: BarChart3 },
    { label: 'Configurações', href: '/ai-studio/knowledge-hub/settings', icon: Settings },
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
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
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
