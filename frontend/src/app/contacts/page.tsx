'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Badge } from '../../components/Badge';
import { api } from '../../services/api';
import {
  Users,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Building,
  UserCheck,
  Mail,
  Phone,
  FileText,
  AlertTriangle,
} from 'lucide-react';

export default function ContactsListPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteContactId, setDeleteContactId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);

      const response = await api.get(`/contacts?${params.toString()}`);
      setContacts(response.data || []);
    } catch (err) {
      console.error('Erro ao carregar lista de contatos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchContacts();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, statusFilter]);

  const handleDelete = async () => {
    if (!deleteContactId) return;
    setDeleting(true);
    try {
      await api.delete(`/contacts/${deleteContactId}`);
      setDeleteContactId(null);
      fetchContacts();
    } catch (err) {
      console.error('Erro ao excluir contato:', err);
    } finally {
      setDeleting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="green">Ativo</Badge>;
      case 'INACTIVE':
        return <Badge variant="slate">Inativo</Badge>;
      case 'LEAD':
        return <Badge variant="amber">Lead</Badge>;
      default:
        return <Badge variant="slate">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header da Página */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Users className="text-brand-500" /> Clientes & Contatos
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Gerencie a base de clientes da sua empresa com isolamento multi-tenant seguro.
            </p>
          </div>
          <a href="/contacts/new">
            <Button variant="primary" leftIcon={<Plus size={18} />}>
              Novo Cliente
            </Button>
          </a>
        </div>

        {/* Barra de Filtros e Busca */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-96">
            <Input
              placeholder="Buscar por nome, e-mail, telefone ou CNPJ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search size={18} />}
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter size={16} className="text-slate-400 shrink-0" />
            <span className="text-xs text-slate-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="">Todos</option>
              <option value="ACTIVE">Ativos</option>
              <option value="LEAD">Leads</option>
              <option value="INACTIVE">Inativos</option>
            </select>
          </div>
        </div>

        {/* Tabela de Clientes */}
        <Card className="p-0 overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-xs text-slate-500">Carregando contatos...</div>
          ) : contacts.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center justify-center">
              <Users size={48} className="text-slate-300 mb-3" />
              <p className="text-sm font-semibold text-slate-700">Nenhum cliente cadastrado</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Cadastre o primeiro cliente da sua empresa para iniciar a gestão do seu CRM.
              </p>
              <a href="/contacts/new" className="mt-4">
                <Button variant="outline" size="sm" leftIcon={<Plus size={16} />}>
                  Cadastrar Cliente
                </Button>
              </a>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-4 py-3.5">Cliente / Contato</th>
                    <th className="px-4 py-3.5">Tipo</th>
                    <th className="px-4 py-3.5">Contato</th>
                    <th className="px-4 py-3.5">Empresa / Cargo</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {contacts.map((contact) => (
                    <tr key={contact.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-brand-500/10 text-brand-600 font-bold flex items-center justify-center border border-brand-500/20 shrink-0">
                            {contact.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <a href={`/contacts/${contact.id}`} className="font-semibold text-slate-900 hover:text-brand-600 transition-colors">
                              {contact.name}
                            </a>
                            {contact.document && (
                              <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                                <FileText size={12} /> {contact.document}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <Badge variant={contact.type === 'COMPANY' ? 'blue' : 'slate'}>
                          {contact.type === 'COMPANY' ? 'Pessoa Jurídica' : 'Pessoa Física'}
                        </Badge>
                      </td>

                      <td className="px-4 py-4 space-y-1">
                        {contact.email && (
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <Mail size={13} className="text-slate-400 shrink-0" />
                            <span>{contact.email}</span>
                          </div>
                        )}
                        {contact.phone && (
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <Phone size={13} className="text-slate-400 shrink-0" />
                            <span>{contact.phone}</span>
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-4">
                        {contact.companyName ? (
                          <div>
                            <p className="font-medium text-slate-800 flex items-center gap-1">
                              <Building size={13} className="text-slate-400" /> {contact.companyName}
                            </p>
                            {contact.position && <p className="text-[11px] text-slate-500 mt-0.5">{contact.position}</p>}
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      <td className="px-4 py-4">{getStatusBadge(contact.status)}</td>

                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <a
                            href={`/contacts/${contact.id}`}
                            title="Ver Detalhes"
                            className="p-2 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                          >
                            <Eye size={16} />
                          </a>
                          <a
                            href={`/contacts/${contact.id}/edit`}
                            title="Editar"
                            className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          >
                            <Edit size={16} />
                          </a>
                          <button
                            onClick={() => setDeleteContactId(contact.id)}
                            title="Excluir"
                            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Modal de Confirmação de Exclusão */}
        {deleteContactId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center gap-3 text-red-600">
                <div className="p-3 bg-red-50 rounded-xl">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Excluir Cliente</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Esta ação é irreversível.</p>
                </div>
              </div>
              <p className="text-xs text-slate-600">
                Tem certeza que deseja remover este cliente da sua base de contatos?
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <Button variant="outline" size="sm" onClick={() => setDeleteContactId(null)}>
                  Cancelar
                </Button>
                <Button variant="danger" size="sm" isLoading={deleting} onClick={handleDelete}>
                  Sim, Excluir
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
