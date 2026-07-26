'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { api } from '../../services/api';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Zap,
  TrendingUp,
  CheckSquare,
  Target,
  RefreshCw,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export default function AiAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Olá! Sou o **ConnectMax IA**, seu assistente de inteligência comercial. Como posso ajudar você no gerenciamento de vendas e clientes da sua empresa hoje?',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const QUICK_PROMPTS = [
    '📊 Qual é o resumo do meu pipeline hoje?',
    '📋 Quantas tarefas estão pendentes com a equipe?',
    '🎯 Qual a distribuição de negócios por etapa?',
    '💡 Recomendações para acelerar vendas',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setLoading(true);

    try {
      const response = await api.post('/ai/chat', { message: query });

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: response.data.response || 'Não foi possível obter a resposta da IA.',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error('Erro ao comunicar com a IA:', err);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: '❌ Desculpe, ocorreu um erro ao consultar os dados comerciais. Tente novamente em instantes.',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="text-brand-500 animate-pulse" /> ConnectMax IA Assistente
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Assistente inteligente treinado nos dados comerciais em tempo real da sua empresa.
            </p>
          </div>
        </div>

        {/* Sugestões de Perguntas Rápida */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              disabled={loading}
              className="text-left p-3 rounded-xl border border-slate-200 bg-white hover:border-brand-500/50 hover:bg-brand-50/30 transition-all text-xs text-slate-700 font-medium flex items-center justify-between group cursor-pointer"
            >
              <span>{prompt}</span>
              <Zap size={14} className="text-brand-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>

        {/* Window de Chat */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
          {/* Top Bar da Janela */}
          <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-brand-500 flex items-center justify-center text-white font-bold shadow-md shadow-brand-500/30">
                <Sparkles size={16} />
              </div>
              <div>
                <h3 className="text-xs font-bold leading-none">ConnectMax AI Engine</h3>
                <span className="text-[10px] text-slate-400">Contexto Multi-Tenant Ativo</span>
              </div>
            </div>
            <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span> On-line
            </span>
          </div>

          {/* Histórico de Mensagens */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="h-8 w-8 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Bot size={18} />
                  </div>
                )}

                <div
                  className={`max-w-xl rounded-2xl p-4 text-xs leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-brand-600 text-white rounded-tr-none'
                      : 'bg-white border border-slate-200/80 text-slate-800 rounded-tl-none whitespace-pre-line'
                  }`}
                >
                  {msg.text}
                  <div
                    className={`text-[9px] mt-2 font-mono text-right ${
                      msg.sender === 'user' ? 'text-brand-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="h-8 w-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                    <User size={18} />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="h-8 w-8 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0">
                  <Bot size={18} />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 text-xs text-slate-500 flex items-center gap-2">
                  <RefreshCw size={14} className="animate-spin text-brand-500" /> Analisando os dados da empresa...
                </div>
              </div>
            )}
          </div>

          {/* Input de Mensagem */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 border-t border-slate-200 bg-white flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Pergunte ao ConnectMax IA sobre seus clientes ou vendas..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={loading}
              className="flex-1 text-xs border border-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-slate-900"
            />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={loading}
              disabled={!inputMessage.trim()}
              rightIcon={<Send size={14} />}
            >
              Enviar
            </Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
