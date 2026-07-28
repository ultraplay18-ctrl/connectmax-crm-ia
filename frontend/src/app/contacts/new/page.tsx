'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Toast, ToastProps } from '../../../components/Toast';
import { ContactForm, ContactFormData } from '../../../components/contacts/ContactForm';
import { api } from '../../../services/api';
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  PlusCircle,
  Calendar,
  TrendingUp,
  List,
} from 'lucide-react';

export default function NewContactPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [createdContact, setCreatedContact] = useState<any>(null);
  const [toast, setToast] = useState<Omit<ToastProps, 'onClose'> | null>(null);

  const handleSubmit = async (formData: ContactFormData) => {
    setLoading(true);
    try {
      const response = await api.post('/contacts', formData);
      const newContact = response.data;
      setCreatedContact(newContact);
      setToast({
        type: 'success',
        message: `Cliente "${newContact.name}" cadastrado com sucesso! Escolha uma ação rápida abaixo.`,
      });
    } catch (err: any) {
      console.error('Erro ao cadastrar contato:', err);
      const msg = err.response?.data?.message || 'Erro ao cadastrar cliente. Verifique os dados.';
      setToast({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAnother = () => {
    setCreatedContact(null);
    setToast(null);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {toast && (
          <div className="fixed top-5 right-5 z-50 max-w-md w-full animate-in fade-in slide-in-from-top-3 duration-300">
            <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
          </div>
        )}

        {/* Topbar */}
        <div className="flex items-center gap-4">
          <a href="/contacts">
            <Button variant="outline" size="sm" leftIcon={<ArrowLeft size={16} />}>
              Voltar
            </Button>
          </a>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              Cadastrar Novo Cliente / Contato
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Preencha as informações abaixo com validação automática de dados.
            </p>
          </div>
        </div>

        {createdContact ? (
          /* Card de Sucesso com Ações Rápidas */
          <Card className="border-emerald-500/30 bg-emerald-50/30 p-8">
            <div className="text-center space-y-6 max-w-lg mx-auto">
              <div className="h-16 w-16 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 size={36} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">Cliente Criado com Sucesso!</h2>
                <p className="text-xs text-slate-600 mt-1">
                  O cliente <strong>{createdContact.name}</strong> foi registrado na base de dados da sua empresa.
                </p>
              </div>

              {/* Grid de Ações Rápidas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-2">
                <a href={`/contacts/${createdContact.id}`} className="w-full">
                  <Button variant="primary" className="w-full justify-center" leftIcon={<Eye size={16} />}>
                    Ver Cliente
                  </Button>
                </a>

                <Button variant="outline" className="w-full justify-center bg-white" onClick={handleCreateAnother} leftIcon={<PlusCircle size={16} />}>
                  Criar Outro Cliente
                </Button>

                <a href={`/calendar?contactId=${createdContact.id}&action=new`} className="w-full">
                  <Button variant="outline" className="w-full justify-center bg-white" leftIcon={<Calendar size={16} />}>
                    Agendar Reunião
                  </Button>
                </a>

                <a href={`/leads?contactId=${createdContact.id}&action=new`} className="w-full">
                  <Button variant="outline" className="w-full justify-center bg-white" leftIcon={<TrendingUp size={16} />}>
                    Criar Lead
                  </Button>
                </a>
              </div>

              <div className="pt-2 border-t border-slate-200/80">
                <a href="/contacts">
                  <Button variant="outline" size="sm" className="bg-white" leftIcon={<List size={16} />}>
                    Voltar para Lista
                  </Button>
                </a>
              </div>
            </div>
          </Card>
        ) : (
          <Card title="Dados do Cliente">
            <ContactForm
              onSubmit={handleSubmit}
              isLoading={loading}
              cancelHref="/contacts"
              submitButtonText="Salvar Cliente"
            />
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
