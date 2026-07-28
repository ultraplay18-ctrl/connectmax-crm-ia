'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';
import { Card } from '../../../../components/Card';
import { Button } from '../../../../components/Button';
import { Skeleton } from '../../../../components/Skeleton';
import { ContactForm, ContactFormData } from '../../../../components/contacts/ContactForm';
import { api } from '../../../../services/api';
import { maskDocumentInput, maskPhoneInput } from '../../../../utils/formatters';
import { ArrowLeft } from 'lucide-react';

export default function EditContactPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [initialData, setInitialData] = useState<ContactFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadContact() {
      try {
        const response = await api.get(`/contacts/${id}`);
        const c = response.data;
        setInitialData({
          name: c.name || '',
          email: c.email || '',
          phone: c.phone ? maskPhoneInput(c.phone) : '',
          document: c.document ? maskDocumentInput(c.document) : '',
          type: c.type || 'INDIVIDUAL',
          companyName: c.companyName || '',
          position: c.position || '',
          notes: c.notes || '',
          status: c.status || 'ACTIVE',
        });
      } catch (err) {
        console.error('Erro ao carregar contato:', err);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadContact();
    }
  }, [id]);

  const handleSubmit = async (formData: ContactFormData) => {
    setSaving(true);
    try {
      await api.patch(`/contacts/${id}`, formData);
      router.push(`/contacts/${id}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-8 w-48" />
          </div>
          <Card>
            <div className="space-y-4 py-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Topbar */}
        <div className="flex items-center gap-4">
          <a href={`/contacts/${id}`}>
            <Button variant="outline" size="sm" leftIcon={<ArrowLeft size={16} />}>
              Cancelar
            </Button>
          </a>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Editar Cliente</h1>
            <p className="text-xs text-slate-500 mt-0.5">Atualize as informações do cliente na sua empresa.</p>
          </div>
        </div>

        <Card title="Editar Dados do Cliente">
          {initialData && (
            <ContactForm
              initialValues={initialData}
              onSubmit={handleSubmit}
              isLoading={saving}
              cancelHref={`/contacts/${id}`}
              submitButtonText="Salvar Alterações"
            />
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
