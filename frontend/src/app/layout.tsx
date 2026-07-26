import React from 'react';
import '../styles/globals.css';
import { AuthProvider } from '../auth/AuthContext';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ConnectMax CRM IA - Plataforma SaaS Multi-Tenant',
  description: 'Sistema SaaS profissional com Inteligência Artificial e isolamento completo de dados por empresa.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-slate-50 font-sans text-slate-900 antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
