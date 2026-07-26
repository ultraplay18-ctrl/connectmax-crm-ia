'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';
import { AiStudioHeader } from '../../../../components/ai-studio/AiStudioHeader';
import { MemoryCenterNavigation } from '../../../../components/ai-studio/MemoryCenterNavigation';
import { api } from '../../../../services/api';
import { MessageSquare, Calendar, User, CheckCircle2 } from 'lucide-react';

export default function MemoryConversationsPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await api.get('/ai-studio/memory-center/conversations');
      setConversations(res.data || []);
    } catch (err) {
      console.error('Erro ao buscar conversas:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <AiStudioHeader
          title="Histórico de Conversas & Sessões"
          subtitle="Acompanhe todas as sessões registradas com busca estruturada por cliente e agente."
          activeTab="Memória"
        />

        <MemoryCenterNavigation />

        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs">Carregando conversas...</div>
        ) : conversations.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center text-xs text-slate-500 max-w-md mx-auto">
            Nenhuma conversa gravada na memória ainda.
          </div>
        ) : (
          <div className="space-y-4">
            {conversations.map((conv) => (
              <div key={conv.id} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={16} className="text-purple-600" />
                    <span className="font-bold text-slate-900">{conv.profile?.customerName || 'Cliente Anônimo'}</span>
                    <span className="text-slate-400">({conv.channel})</span>
                  </div>
                  <span className="text-slate-400 font-mono">{new Date(conv.createdAt).toLocaleString('pt-BR')}</span>
                </div>
                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono">
                  {conv.messages}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
