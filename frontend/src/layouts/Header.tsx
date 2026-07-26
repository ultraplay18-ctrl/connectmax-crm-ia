'use client';

import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Menu, LogOut, Building2, User as UserIcon } from 'lucide-react';
import { Badge } from '../components/Badge';

interface HeaderProps {
  onOpenSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSidebar }) => {
  const { user, logout } = useAuth();

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'Super Admin';
      case 'COMPANY_ADMIN':
        return 'Admin Empresa';
      default:
        return 'Funcionário';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 sm:px-6 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
        >
          <Menu size={20} />
        </button>

        {/* Info da Empresa Atual */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100/80 border border-slate-200 text-slate-700 text-xs font-medium">
          <Building2 size={14} className="text-brand-500" />
          <span>{user?.companyName || 'Empresa Cliente'}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Badge Nível de Acesso */}
        <div className="hidden md:block">
          <Badge variant={user?.role === 'SUPER_ADMIN' ? 'red' : user?.role === 'COMPANY_ADMIN' ? 'blue' : 'slate'}>
            {getRoleLabel(user?.role)}
          </Badge>
        </div>

        {/* Avatar e Perfil do Usuário */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500/10 text-brand-600 font-bold text-sm border border-brand-500/20">
              {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon size={18} />}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-slate-900 leading-none">{user?.name || 'Usuário'}</p>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-none">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={logout}
            title="Sair do sistema"
            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-2"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};
