'use client';

import React from 'react';
import { Bot, ChevronRight, Sparkles } from 'lucide-react';

interface AiStudioHeaderProps {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
  activeTab?: string;
}

export const AiStudioHeader: React.FC<AiStudioHeaderProps> = ({
  title,
  subtitle,
  action,
  activeTab,
}) => {
  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <span className="flex items-center gap-1 text-slate-700">
          <Bot size={14} className="text-brand-500" /> AI Studio
        </span>
        {activeTab && (
          <>
            <ChevronRight size={12} className="text-slate-400" />
            <span className="text-brand-600 font-semibold">{activeTab}</span>
          </>
        )}
      </div>

      {/* Main Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 text-white shadow-md shadow-brand-500/20">
              <Sparkles size={20} />
            </div>
            {title}
          </h1>
          <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
};
