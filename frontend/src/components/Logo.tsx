import React from 'react';
import { Cpu, Sparkles } from 'lucide-react';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ variant = 'dark', size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const iconSizes = {
    sm: 18,
    md: 22,
    lg: 28,
  };

  return (
    <div className="flex items-center gap-2.5 font-bold tracking-tight select-none">
      <div className="relative flex items-center justify-center p-2 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md shadow-brand-500/20">
        <Cpu size={iconSizes[size]} className="animate-pulse" />
        <Sparkles size={12} className="absolute -top-1 -right-1 text-amber-300" />
      </div>
      <div className={`flex items-baseline ${sizeClasses[size]}`}>
        <span className={variant === 'dark' ? 'text-white' : 'text-slate-900'}>
          Connect<span className="text-brand-500">Max</span>
        </span>
        <span className="ml-1.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-500 border border-brand-500/20">
          CRM IA
        </span>
      </div>
    </div>
  );
};
