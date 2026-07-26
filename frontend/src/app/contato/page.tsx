'use client';

import React, { useState } from 'react';
import { PublicHeader } from '../../components/PublicHeader';
import { PublicFooter } from '../../components/PublicFooter';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Badge } from '../../components/Badge';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-brand-500 selection:text-white">
      <PublicHeader />

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Informações de Contato */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <Badge variant="blue">Fale Conosco</Badge>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Fale com Nossos Especialistas de Vendas
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Tire suas dúvidas sobre integração de WhatsApp, limites de planos corporativos personalizados ou solicite uma apresentação sob medida para sua empresa.
              </p>
            </div>

            <div className="space-y-6 pt-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-brand-400">
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">E-mail Corporativo</h4>
                  <p className="text-xs text-slate-400 mt-1">contato@connectmax.com.br</p>
                  <p className="text-xs text-slate-500">Respondemos em até 2 horas úteis</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-brand-400">
                  <Phone size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Telefone & Central</h4>
                  <p className="text-xs text-slate-400 mt-1">0800 591 2026</p>
                  <p className="text-xs text-slate-500">De Segunda a Sexta, das 8h às 18h</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-brand-400">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Escritório Central</h4>
                  <p className="text-xs text-slate-400 mt-1">Av. Paulista, 1000 - Bela Vista</p>
                  <p className="text-xs text-slate-500">São Paulo - SP, Brasil</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulário de Contato */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 p-8 rounded-2xl">
            {submitted ? (
              <div className="text-center py-12 space-y-6">
                <CheckCircle2 size={60} className="text-emerald-400 mx-auto animate-bounce" />
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">Mensagem Enviada!</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Agradecemos seu contato. Um de nossos especialistas em CRM e automação comercial entrará em contato em breve.
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', company: '', message: '' });
                  }}
                  className="border-slate-800 hover:bg-slate-800 text-xs"
                >
                  Enviar Nova Mensagem
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Seu Nome *"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: João Silva"
                    required
                  />
                  <Input
                    label="E-mail Corporativo *"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Ex: joao@empresa.com.br"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Telefone / WhatsApp"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Ex: (11) 99999-9999"
                  />
                  <Input
                    label="Nome da Empresa"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Ex: Minha Empresa S.A."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Como podemos ajudar? *</label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Descreva seu projeto comercial ou envie suas dúvidas técnicas."
                    required
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  />
                </div>

                <Button variant="primary" type="submit" className="w-full py-3 text-xs font-bold" rightIcon={<Send size={14} />}>
                  Enviar Mensagem
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
