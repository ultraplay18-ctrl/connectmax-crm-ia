'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Badge } from '../../components/Badge';
import { api } from '../../services/api';
import {
  CheckSquare,
  Plus,
  Calendar,
  Clock,
  User,
  Building,
  PhoneCall,
  MessageSquare,
  FileText,
  Video,
  CheckCircle2,
  Circle,
  AlertCircle,
  Filter,
  Trash2,
  X,
  Target,
} from 'lucide-react';

export default function ActivitiesPage() {
  const [activeTab, setActiveTab] = useState<'tasks' | 'interactions'>('tasks');
  const [tasks, setTasks] = useState<any[]>([]);
  const [interactions, setInteractions] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [taskStatusFilter, setTaskStatusFilter] = useState('PENDING');

  // Modais
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isInteractionModalOpen, setIsInteractionModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  // Form Nova Tarefa
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: new Date().toISOString().substring(0, 10),
    priority: 'MEDIUM',
    contactId: '',
    leadId: '',
    assignedUserId: '',
  });

  // Form Nova Interação
  const [newInteraction, setNewInteraction] = useState({
    title: '',
    description: '',
    type: 'CALL',
    contactId: '',
    leadId: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tasksRes, interactionsRes, contactsRes, leadsRes, usersRes] = await Promise.all([
        api.get(`/activities/tasks?status=${taskStatusFilter}`),
        api.get('/activities/interactions'),
        api.get('/contacts'),
        api.get('/leads'),
        api.get('/users'),
      ]);

      setTasks(tasksRes.data || []);
      setInteractions(interactionsRes.data || []);
      setContacts(contactsRes.data || []);
      setLeads(leadsRes.data || []);
      setUsers(usersRes.data || []);
    } catch (err) {
      console.error('Erro ao carregar dados de atividades:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [taskStatusFilter]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');
    if (!newTask.title || !newTask.dueDate) {
      setModalError('Título e data de vencimento são obrigatórios.');
      return;
    }

    setModalLoading(true);
    try {
      await api.post('/activities/tasks', newTask);
      setIsTaskModalOpen(false);
      setNewTask({
        title: '',
        description: '',
        dueDate: new Date().toISOString().substring(0, 10),
        priority: 'MEDIUM',
        contactId: '',
        leadId: '',
        assignedUserId: '',
      });
      fetchData();
    } catch (err: any) {
      setModalError(err.response?.data?.message || 'Erro ao criar tarefa.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleCreateInteraction = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');
    if (!newInteraction.title) {
      setModalError('O título do registro é obrigatório.');
      return;
    }

    setModalLoading(true);
    try {
      await api.post('/activities/interactions', newInteraction);
      setIsInteractionModalOpen(false);
      setNewInteraction({
        title: '',
        description: '',
        type: 'CALL',
        contactId: '',
        leadId: '',
      });
      fetchData();
    } catch (err: any) {
      setModalError(err.response?.data?.message || 'Erro ao registrar interação.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleToggleTaskStatus = async (taskId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    try {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: nextStatus } : t)),
      );
      await api.patch(`/activities/tasks/${taskId}`, { status: nextStatus });
    } catch (err) {
      console.error('Erro ao atualizar tarefa:', err);
      fetchData();
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Excluir esta tarefa?')) return;
    try {
      await api.delete(`/activities/tasks/${taskId}`);
      fetchData();
    } catch (err) {
      console.error('Erro ao excluir tarefa:', err);
    }
  };

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'HIGH':
        return <Badge variant="red">Alta Prioridade</Badge>;
      case 'MEDIUM':
        return <Badge variant="amber">Média Prioridade</Badge>;
      default:
        return <Badge variant="slate">Baixa Prioridade</Badge>;
    }
  };

  const getInteractionIcon = (t: string) => {
    switch (t) {
      case 'CALL':
        return <PhoneCall className="text-blue-500" size={18} />;
      case 'MESSAGE':
        return <MessageSquare className="text-emerald-500" size={18} />;
      case 'MEETING':
        return <Video className="text-purple-500" size={18} />;
      default:
        return <FileText className="text-slate-500" size={18} />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <CheckSquare className="text-brand-500" /> Tarefas & Interações CRM
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Organize compromissos da equipe e mantenha o histórico de contato com cada cliente.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" leftIcon={<Plus size={16} />} onClick={() => setIsInteractionModalOpen(true)}>
              Registrar Interação
            </Button>
            <Button variant="primary" size="sm" leftIcon={<Plus size={16} />} onClick={() => setIsTaskModalOpen(true)}>
              Nova Tarefa
            </Button>
          </div>
        </div>

        {/* Abas */}
        <div className="border-b border-slate-200 flex items-center gap-6 text-sm font-semibold">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'tasks'
                ? 'border-brand-500 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <CheckSquare size={18} /> Tarefas da Equipe
          </button>
          <button
            onClick={() => setActiveTab('interactions')}
            className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'interactions'
                ? 'border-brand-500 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <MessageSquare size={18} /> Histórico de Interações ({interactions.length})
          </button>
        </div>

        {/* Conteúdo Aba Tarefas */}
        {activeTab === 'tasks' && (
          <div className="space-y-4">
            {/* Filtro de Status das Tarefas */}
            <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm text-xs">
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-slate-400" />
                <span className="font-semibold text-slate-700">Filtrar Status:</span>
                <select
                  value={taskStatusFilter}
                  onChange={(e) => setTaskStatusFilter(e.target.value)}
                  className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                >
                  <option value="PENDING">Pendentes</option>
                  <option value="IN_PROGRESS">Em Andamento</option>
                  <option value="COMPLETED">Concluídas</option>
                  <option value="">Todas</option>
                </select>
              </div>

              <span className="text-slate-500">Exibindo <strong>{tasks.length}</strong> tarefa(s)</span>
            </div>

            {/* Lista de Tarefas */}
            <Card className="p-0 overflow-hidden">
              {loading ? (
                <div className="py-16 text-center text-xs text-slate-500">Carregando tarefas...</div>
              ) : tasks.length === 0 ? (
                <div className="py-16 text-center text-xs text-slate-400">Nenhuma tarefa encontrada neste status.</div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {tasks.map((task) => (
                    <div key={task.id} className="p-4 hover:bg-slate-50/80 transition-colors flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => handleToggleTaskStatus(task.id, task.status)}
                          className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors"
                        >
                          {task.status === 'COMPLETED' ? (
                            <CheckCircle2 className="text-emerald-500" size={20} />
                          ) : (
                            <Circle size={20} />
                          )}
                        </button>
                        <div>
                          <p
                            className={`text-sm font-semibold text-slate-900 ${
                              task.status === 'COMPLETED' ? 'line-through text-slate-400' : ''
                            }`}
                          >
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="text-xs text-slate-500 mt-1">{task.description}</p>
                          )}

                          <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-slate-500">
                            <span className="flex items-center gap-1 font-mono text-slate-600">
                              <Calendar size={13} className="text-slate-400" />
                              Vence: {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                            </span>

                            {task.contact && (
                              <span className="flex items-center gap-1 text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                                <Building size={12} className="text-slate-400" /> {task.contact.name}
                              </span>
                            )}

                            {task.lead && (
                              <span className="flex items-center gap-1 text-brand-600 bg-brand-50 px-2 py-0.5 rounded font-medium">
                                <Target size={12} /> {task.lead.title}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {getPriorityBadge(task.priority)}
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Conteúdo Aba Histórico de Interações */}
        {activeTab === 'interactions' && (
          <Card>
            {loading ? (
              <div className="py-16 text-center text-xs text-slate-500">Carregando histórico...</div>
            ) : interactions.length === 0 ? (
              <div className="py-16 text-center text-xs text-slate-400">Nenhum registro de interação gravado.</div>
            ) : (
              <div className="relative border-l-2 border-slate-200 ml-4 space-y-6 py-2">
                {interactions.map((item) => (
                  <div key={item.id} className="relative pl-6">
                    <div className="absolute -left-3.5 top-0.5 p-1 rounded-full bg-white border border-slate-200 shadow-sm">
                      {getInteractionIcon(item.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(item.createdAt).toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 whitespace-pre-line leading-relaxed">
                        {item.description || 'Sem descrição adicional.'}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                        <span>Registrado por: <strong>{item.user?.name || 'Sistema'}</strong></span>
                        {item.contact && <span>• Cliente: <strong>{item.contact.name}</strong></span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Modal Nova Tarefa */}
        {isTaskModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CheckSquare className="text-brand-500" /> Nova Tarefa CRM
                </h3>
                <button onClick={() => setIsTaskModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              {modalError && (
                <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle size={16} /> {modalError}
                </div>
              )}

              <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
                <Input
                  label="Título da Tarefa *"
                  placeholder="Ex: Fazer ligação de acompanhamento da proposta"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  required
                />

                <Input
                  label="Data de Vencimento *"
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  required
                />

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block font-semibold text-slate-700 uppercase tracking-wider">Prioridade</label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs focus:outline-none"
                    >
                      <option value="LOW">Baixa</option>
                      <option value="MEDIUM">Média</option>
                      <option value="HIGH">Alta</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-semibold text-slate-700 uppercase tracking-wider">Responsável</label>
                    <select
                      value={newTask.assignedUserId}
                      onChange={(e) => setNewTask({ ...newTask, assignedUserId: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs focus:outline-none"
                    >
                      <option value="">Atribuir a mim</option>
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider">Vincular a Cliente (Opcional)</label>
                  <select
                    value={newTask.contactId}
                    onChange={(e) => setNewTask({ ...newTask, contactId: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs focus:outline-none"
                  >
                    <option value="">Sem vínculo de cliente</option>
                    {contacts.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider">Descrição / Detalhes</label>
                  <textarea
                    rows={3}
                    placeholder="Instruções para a realização da tarefa..."
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-none"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => setIsTaskModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" variant="primary" size="sm" isLoading={modalLoading}>
                    Criar Tarefa
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Registrar Interação */}
        {isInteractionModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="text-brand-500" /> Registrar Interação CRM
                </h3>
                <button onClick={() => setIsInteractionModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              {modalError && (
                <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle size={16} /> {modalError}
                </div>
              )}

              <form onSubmit={handleCreateInteraction} className="space-y-4 text-xs">
                <Input
                  label="Título do Registro *"
                  placeholder="Ex: Chamada de alinhamento com a diretoria"
                  value={newInteraction.title}
                  onChange={(e) => setNewInteraction({ ...newInteraction, title: e.target.value })}
                  required
                />

                <div className="space-y-1.5">
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider">Tipo de Interação</label>
                  <select
                    value={newInteraction.type}
                    onChange={(e) => setNewInteraction({ ...newInteraction, type: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs focus:outline-none"
                  >
                    <option value="CALL">📞 Chamada Telefônica</option>
                    <option value="MESSAGE">💬 Mensagem / WhatsApp</option>
                    <option value="MEETING">🎥 Reunião / Videocall</option>
                    <option value="NOTE">📝 Nota Interna</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider">Cliente Associado</label>
                  <select
                    value={newInteraction.contactId}
                    onChange={(e) => setNewInteraction({ ...newInteraction, contactId: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs focus:outline-none"
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
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider">Resumo / Anotações</label>
                  <textarea
                    rows={4}
                    placeholder="Descreva os pontos combinados e próximos passos..."
                    value={newInteraction.description}
                    onChange={(e) => setNewInteraction({ ...newInteraction, description: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-none"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => setIsInteractionModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" variant="primary" size="sm" isLoading={modalLoading}>
                    Salvar Registro
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
