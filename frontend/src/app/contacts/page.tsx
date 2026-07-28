'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Badge } from '../../components/Badge';
import { TableRowSkeleton, Skeleton } from '../../components/Skeleton';
import { Toast, ToastProps } from '../../components/Toast';
import { api } from '../../services/api';
import { formatDocument, formatPhone } from '../../utils/formatters';
import {
  Users,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Building,
  Mail,
  Phone,
  FileText,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Download,
  CheckCircle2,
  TrendingUp,
  UserCheck,
} from 'lucide-react';

export interface Contact {
  id: string;
  companyId: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  document?: string | null;
  type: 'INDIVIDUAL' | 'COMPANY';
  companyName?: string | null;
  position?: string | null;
  notes?: string | null;
  status: 'ACTIVE' | 'INACTIVE' | 'LEAD';
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ContactStats {
  total: number;
  active: number;
  leads: number;
  inactive: number;
  companies: number;
  individuals: number;
}

function ContactsListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [stats, setStats] = useState<ContactStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [meta, setMeta] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || '');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));
  const [limit, setLimit] = useState(parseInt(searchParams.get('limit') || '10', 10));
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>((searchParams.get('sortOrder') as any) || 'desc');

  const [deleteContact, setDeleteContact] = useState<Contact | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<Omit<ToastProps, 'onClose'> | null>(null);

  const updateUrlParams = useCallback(
    (newParams: Record<string, string | number>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(newParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.set(key, String(value));
        } else {
          params.delete(key);
        }
      });
      router.replace(`/contacts?${params.toString()}`);
    },
    [searchParams, router],
  );

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const response = await api.get('/contacts/stats');
      setStats(response.data);
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      if (typeFilter) params.append('type', typeFilter);
      params.append('page', String(page));
      params.append('limit', String(limit));
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);

      const response = await api.get(`/contacts?${params.toString()}`);
      if (response.data && Array.isArray(response.data.data)) {
        setContacts(response.data.data);
        setMeta(response.data.meta);
      } else if (Array.isArray(response.data)) {
        setContacts(response.data);
        setMeta({
          total: response.data.length,
          page: 1,
          limit: response.data.length || 10,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        });
      }
    } catch (err: any) {
      console.error('Erro ao carregar lista de contatos:', err);
      const msg = err.response?.data?.message || 'Erro ao comunicar com o servidor. Tente novamente.';
      setToast({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, typeFilter, page, limit, sortBy, sortOrder]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchContacts();
      updateUrlParams({
        search,
        status: statusFilter,
        type: typeFilter,
        page,
        limit,
        sortBy,
        sortOrder,
      });
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, statusFilter, typeFilter, page, limit, sortBy, sortOrder, fetchContacts, updateUrlParams]);

  const handleDelete = async () => {
    if (!deleteContact) return;
    setDeleting(true);
    try {
      await api.delete(`/contacts/${deleteContact.id}`);
      setToast({ type: 'success', message: `Cliente "${deleteContact.name}" excluído com sucesso!` });
      setDeleteContact(null);
      fetchContacts();
      fetchStats();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Erro ao excluir contato.';
      setToast({ type: 'error', message: msg });
    } finally {
      setDeleting(false);
    }
  };

  const handleExportCsv = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      if (typeFilter) params.append('type', typeFilter);
      params.append('limit', '1000'); // Exportar registros filtrados

      const response = await api.get(`/contacts?${params.toString()}`);
      const list: Contact[] = response.data.data || response.data || [];

      if (list.length === 0) {
        setToast({ type: 'info', message: 'Nenhum cliente disponível para exportação.' });
        return;
      }

      const headers = ['Nome', 'Tipo', 'Documento', 'E-mail', 'Telefone', 'Empresa', 'Cargo', 'Status', 'Data Cadastro'];
      const rows = list.map((c) => [
        `"${c.name.replace(/"/g, '""')}"`,
        `"${c.type === 'COMPANY' ? 'Pessoa Jurídica' : 'Pessoa Física'}"`,
        `"${c.document || ''}"`,
        `"${c.email || ''}"`,
        `"${c.phone || ''}"`,
        `"${(c.companyName || '').replace(/"/g, '""')}"`,
        `"${(c.position || '').replace(/"/g, '""')}"`,
        `"${c.status}"`,
        `"${new Date(c.createdAt).toLocaleDateString('pt-BR')}"`,
      ]);

      const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `clientes_connectmax_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setToast({ type: 'success', message: `${list.length} clientes exportados para CSV com sucesso!` });
    } catch (err) {
      console.error('Erro ao exportar CSV:', err);
      setToast({ type: 'error', message: 'Erro ao gerar arquivo de exportação CSV.' });
    }
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const getSortIcon = (field: string) => {
    if (sortBy !== field) return <ArrowUpDown size={14} className="text-slate-400 opacity-60 ml-1 inline" />;
    return sortOrder === 'asc' ? (
      <ArrowUp size={14} className="text-brand-600 ml-1 inline" />
    ) : (
      <ArrowDown size={14} className="text-brand-600 ml-1 inline" />
    );
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
    <div className="space-y-6">
      {/* Toast Feedback */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 max-w-md w-full animate-in fade-in slide-in-from-top-3 duration-300">
          <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
        </div>
      )}

      {/* Header da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="text-brand-500" /> Clientes & Contatos
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gerencie a base de clientes da sua empresa com isolamento multi-tenant seguro e buscas otimizadas.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" onClick={handleExportCsv} leftIcon={<Download size={16} />}>
            Exportar CSV
          </Button>
          <a href="/contacts/new">
            <Button variant="primary" size="sm" leftIcon={<Plus size={18} />}>
              Novo Cliente
            </Button>
          </a>
        </div>
      </div>

      {/* KPI Cards Executivos de Resumo */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-xl bg-brand-500/10 text-brand-600">
            <Users size={20} />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total de Clientes</p>
            <p className="text-lg font-bold text-slate-900">{statsLoading ? <Skeleton className="h-6 w-12" /> : stats?.total || 0}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600">
            <UserCheck size={20} />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Clientes Ativos</p>
            <p className="text-lg font-bold text-slate-900">{statsLoading ? <Skeleton className="h-6 w-12" /> : stats?.active || 0}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600">
            <TrendingUp size={20} />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Leads no Funil</p>
            <p className="text-lg font-bold text-slate-900">{statsLoading ? <Skeleton className="h-6 w-12" /> : stats?.leads || 0}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600">
            <Building size={20} />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Pessoa Jurídica (PJ)</p>
            <p className="text-lg font-bold text-slate-900">{statsLoading ? <Skeleton className="h-6 w-12" /> : stats?.companies || 0}</p>
          </div>
        </div>
      </div>

      {/* Barra de Filtros e Busca Otimizada */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Buscar nome, e-mail, telefone ou documento..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            leftIcon={<Search size={18} />}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Filtro Status */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Filter size={14} className="text-slate-400 shrink-0" />
            <span className="font-semibold">Status:</span>
            <select
              aria-label="Filtrar por Status"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="">Todos</option>
              <option value="ACTIVE">Ativos</option>
              <option value="LEAD">Leads</option>
              <option value="INACTIVE">Inativos</option>
            </select>
          </div>

          {/* Filtro Tipo */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-semibold">Tipo:</span>
            <select
              aria-label="Filtrar por Tipo de Pessoa"
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="">Todos</option>
              <option value="INDIVIDUAL">Pessoa Física</option>
              <option value="COMPANY">Pessoa Jurídica</option>
            </select>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              fetchContacts();
              fetchStats();
            }}
            className="text-slate-600 hover:text-brand-600"
            title="Atualizar dados"
            aria-label="Atualizar lista"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </Button>
        </div>
      </div>

      {/* Tabela de Clientes */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th
                  onClick={() => handleSort('name')}
                  className="px-4 py-3.5 cursor-pointer hover:bg-slate-100/80 transition-colors"
                >
                  Cliente / Contato {getSortIcon('name')}
                </th>
                <th
                  onClick={() => handleSort('type')}
                  className="px-4 py-3.5 cursor-pointer hover:bg-slate-100/80 transition-colors"
                >
                  Tipo {getSortIcon('type')}
                </th>
                <th className="px-4 py-3.5">Contato</th>
                <th
                  onClick={() => handleSort('companyName')}
                  className="px-4 py-3.5 cursor-pointer hover:bg-slate-100/80 transition-colors"
                >
                  Empresa / Cargo {getSortIcon('companyName')}
                </th>
                <th
                  onClick={() => handleSort('status')}
                  className="px-4 py-3.5 cursor-pointer hover:bg-slate-100/80 transition-colors"
                >
                  Status {getSortIcon('status')}
                </th>
                <th className="px-4 py-3.5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <TableRowSkeleton rows={limit > 10 ? 10 : limit} />
              ) : contacts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Users size={48} className="text-slate-300 mb-3" />
                      {search || statusFilter || typeFilter ? (
                        <>
                          <p className="text-sm font-semibold text-slate-700">Nenhum resultado encontrado</p>
                          <p className="text-xs text-slate-400 mt-1 max-w-sm">
                            Nenhum cliente corresponde aos filtros aplicados. Tente buscar por outros termos.
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-4"
                            onClick={() => {
                              setSearch('');
                              setStatusFilter('');
                              setTypeFilter('');
                              setPage(1);
                            }}
                          >
                            Limpar Filtros
                          </Button>
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-semibold text-slate-700">Nenhum cliente cadastrado</p>
                          <p className="text-xs text-slate-400 mt-1 max-w-sm">
                            Cadastre o primeiro cliente da sua empresa para iniciar a gestão no ConnectMax CRM IA.
                          </p>
                          <a href="/contacts/new" className="mt-4">
                            <Button variant="outline" size="sm" leftIcon={<Plus size={16} />}>
                              Cadastrar Cliente
                            </Button>
                          </a>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                contacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-brand-500/10 text-brand-600 font-bold flex items-center justify-center border border-brand-500/20 shrink-0">
                          {contact.name ? contact.name.charAt(0).toUpperCase() : 'C'}
                        </div>
                        <div>
                          <a
                            href={`/contacts/${contact.id}`}
                            className="font-semibold text-slate-900 hover:text-brand-600 transition-colors"
                          >
                            {contact.name}
                          </a>
                          {contact.document && (
                            <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                              <FileText size={12} /> {formatDocument(contact.document)}
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
                      {contact.email ? (
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Mail size={13} className="text-slate-400 shrink-0" />
                          <span>{contact.email}</span>
                        </div>
                      ) : null}
                      {contact.phone ? (
                        <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
                          <Phone size={13} className="text-slate-400 shrink-0" />
                          <span>{formatPhone(contact.phone)}</span>
                        </div>
                      ) : null}
                      {!contact.email && !contact.phone && <span className="text-slate-400">-</span>}
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
                          aria-label={`Ver detalhes de ${contact.name}`}
                          className="p-2 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                        >
                          <Eye size={16} />
                        </a>
                        <a
                          href={`/contacts/${contact.id}/edit`}
                          title="Editar"
                          aria-label={`Editar ${contact.name}`}
                          className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        >
                          <Edit size={16} />
                        </a>
                        <button
                          onClick={() => setDeleteContact(contact)}
                          title="Excluir"
                          aria-label={`Excluir ${contact.name}`}
                          className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Rodapé com Paginação */}
        {!loading && contacts.length > 0 && (
          <div className="bg-slate-50/80 border-t border-slate-200 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span>Mostrar</span>
              <select
                aria-label="Registros por página"
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs focus:outline-none"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span>registros por página</span>
              <span className="text-slate-400 font-mono ml-2">
                (Total: {meta.total} {meta.total === 1 ? 'registro' : 'registros'})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-500">
                Página <strong>{meta.page}</strong> de <strong>{meta.totalPages}</strong>
              </span>
              <div className="flex items-center gap-1 ml-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!meta.hasPreviousPage}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  className="px-2 py-1"
                  aria-label="Página anterior"
                >
                  <ChevronLeft size={16} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!meta.hasNextPage}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="px-2 py-1"
                  aria-label="Próxima página"
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Modal de Confirmação de Exclusão */}
      {deleteContact && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-delete-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
        >
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-100">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-3 bg-red-50 rounded-xl">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 id="modal-delete-title" className="text-base font-bold text-slate-900">
                  Excluir Cliente
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Esta ação é irreversível.</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tem certeza que deseja remover o cliente <strong className="text-slate-900">{deleteContact.name}</strong> da sua base de contatos?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="outline" size="sm" onClick={() => setDeleteContact(null)}>
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
  );
}

export default function ContactsListPage() {
  return (
    <DashboardLayout>
      <Suspense
        fallback={
          <div className="py-24 text-center text-xs text-slate-500">
            Carregando Clientes & Contatos...
          </div>
        }
      >
        <ContactsListContent />
      </Suspense>
    </DashboardLayout>
  );
}
