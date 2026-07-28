import React from 'react';

interface BadgeProps {
  variant?: 'blue' | 'slate' | 'green' | 'amber' | 'red';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'slate', children, className = '' }) => {
  const variantClasses = {
    blue: 'bg-brand-500/10 text-brand-600 border-brand-500/20',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    red: 'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};
