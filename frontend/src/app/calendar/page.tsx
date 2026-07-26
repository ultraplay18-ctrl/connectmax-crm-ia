'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Badge } from '../../components/Badge';
import { api } from '../../services/api';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  MapPin,
  Building,
  Target,
  User,
  X,
  CheckCircle2,
  AlertCircle,
  Video,
  Trash2,
} from 'lucide-react';

export default function CalendarPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal Novo Evento
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  const now = new Date();
  const defaultStart = new Date(now.getTime() + 3600000).toISOString().substring(0, 16);
  const defaultEnd = new Date(now.getTime() + 7200000).toISOString().substring(0, 16);

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    startDate: defaultStart,
    endDate: defaultEnd,
    location: '',
    contactId: '',
    leadId: '',
    assignedUserId: '',
  });

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await api.get('/activities/events');
      setEvents(response.data || []);
    } catch (err) {
      console.error('Erro ao buscar eventos:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuxiliaryData = async () => {
    try {
      const [contactsRes, leadsRes, usersRes] = await Promise.all([
        api.get('/contacts'),
        api.get('/leads'),
        api.get('/users'),
      ]);
      setContacts(contactsRes.data || []);
      setLeads(leadsRes.data || []);
      setUsers(usersRes.data || []);
    } catch (err) {
      console.error('Erro ao buscar contatos:', err);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchAuxiliaryData();
  }, []);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');

    if (!newEvent.title || !newEvent.startDate || !newEvent.endDate) {
      setModalError('Título, data inicial e final são obrigatórios.');
      return;
    }

    setModalLoading(true);
    try {
      await api.post('/activities/events', newEvent);
      setIsModalOpen(false);
      setNewEvent({
        title: '',
        description: '',
        startDate: defaultStart,
        endDate: defaultEnd,
        location: '',
        contactId: '',
        leadId: '',
        assignedUserId: '',
      });
      fetchEvents();
    } catch (err: any) {
      setModalError(err.response?.data?.message || 'Erro ao agendar compromisso.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!window.confirm('Cancelar e excluir este compromisso?')) return;
    try {
      await api.delete(`/activities/events/${eventId}`);
      fetchEvents();
    } catch (err) {
      console.error('Erro ao cancelar evento:', err);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <CalendarIcon className="text-brand-500" /> Agenda de Reuniões & Compromissos
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Agende videocalls, reuniões presenciais e apresentações vinculadas a clientes e oportunidades.
            </p>
          </div>
          <Button variant="primary" leftIcon={<Plus size={18} />} onClick={() => setIsModalOpen(true)}>
            Novo Compromisso
          </Button>
        </div>

        {/* Lista de Eventos Agendados */}
        <Card title="Próximos Compromissos da Equipe">
          {loading ? (
            <div className="py-16 text-center text-xs text-slate-500">Carregando agenda...</div>
          ) : events.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center justify-center">
              <CalendarIcon size={44} className="text-slate-300 mb-3" />
              <p className="text-sm font-semibold text-slate-700">Nenhum compromisso agendado</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Agende a primeira reunião com um cliente para acompanhar o progresso comercial.
              </p>
              <Button variant="outline" size="sm" className="mt-4" leftIcon={<Plus size={16} />} onClick={() => setIsModalOpen(true)}>
                Agendar Reunião
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => {
                const start = new Date(event.startDate);
                const end = new Date(event.endDate);

                return (
                  <div
                    key={event.id}
                    className="p-4 rounded-xl border border-slate-200/80 bg-white hover:border-brand-500/40 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      {/* Box de Data */}
                      <div className="flex flex-col items-center justify-center h-14 w-14 rounded-xl bg-brand-500/10 text-brand-600 border border-brand-500/20 shrink-0">
                        <span className="text-xs font-semibold uppercase">
                          {start.toLocaleDateString('pt-BR', { month: 'short' })}
                        </span>
                        <span className="text-lg font-bold leading-none">{start.getDate()}</span>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-slate-900">{event.title}</h4>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1 font-mono">
                            <Clock size={13} className="text-slate-400" />
                            {start.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} -{' '}
                            {end.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>

                          {event.location && (
                            <span className="flex items-center gap-1 text-brand-600">
                              <Video size={13} />
                              <a href={event.location} target="_blank" rel="noreferrer" className="underline truncate max-w-xs">
                                {event.location}
                              </a>
                            </span>
                          )}
                        </div>

                        {event.description && <p className="text-xs text-slate-600 mt-1">{event.description}</p>}

                        <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500">
                          {event.contact && (
                            <span className="flex items-center gap-1 font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                              <Building size={12} className="text-slate-400" /> {event.contact.name}
                            </span>
                          )}
                          {event.assignedUser && (
                            <span>Organizador: <strong>{event.assignedUser.name}</strong></span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 shrink-0">
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Cancelar Reunião"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Modal Novo Evento na Agenda */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CalendarIcon className="text-brand-500" /> Agendar Novo Compromisso
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>

              {modalError && (
                <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle size={16} /> {modalError}
                </div>
              )}

              <form onSubmit={handleCreateEvent} className="space-y-4 text-xs">
                <Input
                  label="Título da Reunião / Compromisso *"
                  placeholder="Ex: Apresentação da Proposta Comercial"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Data/Hora de Início *"
                    type="datetime-local"
                    value={newEvent.startDate}
                    onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
                    required
                  />

                  <Input
                    label="Data/Hora de Término *"
                    type="datetime-local"
                    value={newEvent.endDate}
                    onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
                    required
                  />
                </div>

                <Input
                  label="Local ou Link da Reunião"
                  placeholder="Ex: https://meet.google.com/abc-defg ou Sala 3"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block font-semibold text-slate-700 uppercase tracking-wider">Cliente Associado</label>
                    <select
                      value={newEvent.contactId}
                      onChange={(e) => setNewEvent({ ...newEvent, contactId: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:outline-none"
                    >
                      <option value="">Selecione o Cliente</option>
                      {contacts.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-semibold text-slate-700 uppercase tracking-wider">Oportunidade (Lead)</label>
                    <select
                      value={newEvent.leadId}
                      onChange={(e) => setNewEvent({ ...newEvent, leadId: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:outline-none"
                    >
                      <option value="">Selecione a Oportunidade</option>
                      {leads.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider">Pauta / Observações</label>
                  <textarea
                    rows={3}
                    placeholder="Assuntos a serem abordados na reunião..."
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-none"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                  <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" variant="primary" size="sm" isLoading={modalLoading} rightIcon={<CheckCircle2 size={16} />}>
                    Confirmar Agendamento
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
