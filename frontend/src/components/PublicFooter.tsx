import React from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo and About */}
        <div className="space-y-4">
          <Logo variant="dark" size="sm" />
          <p className="text-xs text-slate-500 leading-relaxed">
            Plataforma SaaS Multi-Tenant robusta com inteligência artificial nativa, automatização de atendimento via WhatsApp e CRM financeiro completo.
          </p>
          <div className="flex space-x-4 text-slate-500 text-xs">
            <span className="flex items-center gap-1"><Globe size={14} /> Global</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Mail size={14} /> suporte@connectmax.com.br</span>
          </div>
        </div>

        {/* Product links */}
        <div>
          <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Produto</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/recursos" className="hover:text-white transition-colors">
                Recursos e Funcionalidades
              </Link>
            </li>
            <li>
              <Link href="/planos" className="hover:text-white transition-colors">
                Tabela de Planos
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-white transition-colors">
                Acessar o Sistema
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-white transition-colors">
                Iniciar Teste de 14 dias
              </Link>
            </li>
          </ul>
        </div>

        {/* Resources links */}
        <div>
          <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Suporte & Contato</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/contato" className="hover:text-white transition-colors">
                Falar com Vendas
              </Link>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Documentação Técnica
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Portal de Privacidade
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Status da Plataforma 🟢
              </a>
            </li>
          </ul>
        </div>

        {/* Contacts info */}
        <div className="space-y-3 text-xs">
          <h4 className="text-white font-bold text-sm mb-1 uppercase tracking-wider">Contato Corporativo</h4>
          <p className="flex items-center gap-2 text-slate-400">
            <Mail size={14} className="text-brand-500" /> contato@connectmax.com.br
          </p>
          <p className="flex items-center gap-2 text-slate-400">
            <Phone size={14} className="text-brand-500" /> 0800 591 2026
          </p>
          <p className="flex items-center gap-2 text-slate-400">
            <MapPin size={14} className="text-brand-500" /> Av. Paulista, 1000 - São Paulo, SP
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-900/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600">
        <p>© 2026 ConnectMax CRM IA. Todos os direitos reservados. CNPJ: 99.999.999/0001-99</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-slate-400 transition-colors">Termos de Uso</a>
          <a href="#" className="hover:text-slate-400 transition-colors">Política de Privacidade</a>
        </div>
      </div>
    </footer>
  );
};
