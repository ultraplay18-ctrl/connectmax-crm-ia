'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './Logo';
import { Button } from './Button';
import { Menu, X, ArrowRight } from 'lucide-react';

export const PublicHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Recursos', href: '/recursos' },
    { label: 'Planos', href: '/planos' },
    { label: 'Contato', href: '/contato' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <span className="cursor-pointer">
            <Logo variant="dark" size="md" />
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <span
                  className={`hover:text-white transition-colors cursor-pointer ${
                    isActive ? 'text-brand-400 font-bold' : ''
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <span>
              <Button variant="outline" size="sm" className="border-slate-700 text-slate-200 hover:bg-slate-800">
                Entrar
              </Button>
            </span>
          </Link>
          <Link href="/register?plan=Professional">
            <span>
              <Button variant="primary" size="sm" rightIcon={<ArrowRight size={16} />}>
                Testar Grátis
              </Button>
            </span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-slate-400 hover:text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800/80 px-4 pt-2 pb-6 space-y-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <span
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-900 hover:text-white transition-colors cursor-pointer ${
                    isActive ? 'text-brand-400 font-bold bg-slate-900/50' : 'text-slate-300'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
          <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
            <Link href="/login" className="w-full">
              <span onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full border-slate-700 text-slate-200 hover:bg-slate-800">
                  Entrar
                </Button>
              </span>
            </Link>
            <Link href="/register?plan=Professional" className="w-full">
              <span onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" className="w-full" rightIcon={<ArrowRight size={16} />}>
                  Testar 14 Dias Grátis
                </Button>
              </span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
