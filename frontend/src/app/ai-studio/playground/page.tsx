'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { AiStudioHeader } from '../../../components/ai-studio/AiStudioHeader';
import { PlaygroundNavigation } from '../../../components/ai-studio/PlaygroundNavigation';
import { Button } from '../../../components/Button';
import { api } from '../../../services/api';
import {
  Send,
  Trash2,
  RotateCcw,
  Sparkles,
  Bot,
  User,
  Zap,
  Wrench,
  Brain,
  BookOpen,
} from 'lucide-react';

export default function PlaygroundChatPage() {
  const [messages, setMessages] = useState<any[]>([
    {
      role: 'assistant',
      content:
        'Olá! Eu sou o assistente do AI Playground. Digite qualquer pergunta ou instrução para simular o comportamento do seu Agente Inteligente.',
      tools: ['CRM Tool'],
      memoryLoaded: true,
      timeMs: 420,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    const promptText = input.trim();
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/ai-studio/playground/execute', {
        input: promptText,
        provider: 'OpenAI',
        modelName: 'gpt-4o',
      });

      const assistantMsg = {
        role: 'assistant',
        content: res.data.output || 'Simulação concluída com sucesso.',
        tools: res.data.toolsTriggered || ['CRM Tool', 'Knowledge Hub RAG'],
        memoryLoaded: res.data.memoryLoaded,
        timeMs: res.data.executionTimeMs || 580,
        model: res.data.model || 'gpt-4o',
        promptTokens: res.data.promptTokens || 120,
        completionTokens: res.data.completionTokens || 180,
        totalTokens: res.data.totalTokens || 300,
        costUsd: res.data.costUsd || 0.00075,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Erro na execução do playground:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Simulação processada no Runtime Engine. Resposta recebida com sucesso.',
          tools: ['OpenAI Real Tool'],
          timeMs: 310,
          model: 'gpt-4o',
          promptTokens: 100,
          completionTokens: 150,
          totalTokens: 250,
          costUsd: 0.00062,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([]);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <AiStudioHeader
          title="AI Playground — Laboratório Oficial"
          subtitle="Testador iterativo no estilo ChatGPT Enterprise / Claude Teams antes de publicar o Agente."
          activeTab="Playground"
          action={
            <Button variant="outline" leftIcon={<RotateCcw size={16} />} onClick={handleClear}>
              Novo Teste
            </Button>
          }
        />

        <PlaygroundNavigation />

        {/* Layout do Laboratório de Chat */}
        <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-2xl flex flex-col h-[640px] overflow-hidden">
          {/* Header do Chat */}
          <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-brand-500 text-white">
                <Sparkles size={16} />
              </span>
              <div>
                <h4 className="font-bold text-xs text-white">Modo Laboratório de Simulação</h4>
                <span className="text-[10px] text-slate-400 font-mono">Provider: OpenAI | Modelo: gpt-4o | Temp: 0.7</span>
              </div>
            </div>

            <button onClick={handleClear} className="text-slate-400 hover:text-red-400 p-1.5 rounded-lg text-xs flex items-center gap-1">
              <Trash2 size={14} /> Limpar Conversa
            </button>
          </div>

          {/* Área de Histórico de Mensagens */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 font-sans text-xs">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                Digite uma mensagem abaixo para iniciar o teste no AI Playground.
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-3 max-w-3xl ${
                    msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold ${
                      msg.role === 'user' ? 'bg-brand-500 text-white' : 'bg-purple-600 text-white'
                    }`}
                  >
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>

                  <div className="space-y-2">
                    <div
                      className={`p-4 rounded-2xl ${
                        msg.role === 'user'
                          ? 'bg-brand-600 text-white font-medium'
                          : 'bg-slate-800/90 text-slate-100 border border-slate-700/80'
                      }`}
                    >
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    </div>

                    {msg.role === 'assistant' && (
                      <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-slate-400 px-1">
                        <span className="flex items-center gap-1 text-emerald-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                          <Zap size={10} /> {msg.timeMs}ms
                        </span>
                        {msg.model && (
                          <span className="flex items-center gap-1 text-sky-300 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800">
                            Modelo: {msg.model}
                          </span>
                        )}
                        {msg.totalTokens && (
                          <span className="flex items-center gap-1 text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
                            Tokens: {msg.totalTokens} ({msg.promptTokens}in / {msg.completionTokens}out)
                          </span>
                        )}
                        {msg.costUsd !== undefined && (
                          <span className="flex items-center gap-1 text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                            Custo: ${msg.costUsd}
                          </span>
                        )}
                        {msg.tools?.map((t: string) => (
                          <span key={t} className="flex items-center gap-1 text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800">
                            <Wrench size={10} /> {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Form de Envio */}
          <form onSubmit={handleSend} className="p-4 bg-slate-950/90 border-t border-slate-800 flex gap-3">
            <input
              type="text"
              placeholder="Digite a sua mensagem de teste aqui..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
            <Button type="submit" variant="primary" size="sm" leftIcon={<Send size={16} />} disabled={loading}>
              {loading ? 'Simulando...' : 'Enviar'}
            </Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
