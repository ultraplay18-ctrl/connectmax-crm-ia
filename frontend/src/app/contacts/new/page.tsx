'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { ContactForm, ContactFormData } from '../../../components/contacts/ContactForm';
import { api } from '../../../services/api';
import { ArrowLeft } from 'lucide-react';

export default function NewContactPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: ContactFormData) => {
    setLoading(true);
    try {
      await api.post('/contacts', formData);
      router.push('/contacts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
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

        <Card title="Dados do Cliente">
          <ContactForm
            onSubmit={handleSubmit}
            isLoading={loading}
            cancelHref="/contacts"
            submitButtonText="Salvar Cliente"
          />
        </Card>
      </div>
    </DashboardLayout>
  );
}
