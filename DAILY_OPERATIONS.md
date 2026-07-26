# 📋 Manual de Operação Diária - ConnectMax CRM IA

Este guia destina-se à equipe de operações e infraestrutura do ConnectMax CRM IA, detalhando as rotinas de manutenção, monitoramento e atendimento necessárias para manter a plataforma SaaS operando com estabilidade.

---

## 1. Rotinas Diárias de Monitoramento

### 1.1 Saúde do Servidor (VPS)
Diariamente, verifique a utilização de recursos da VPS (CPU, Memória RAM e Armazenamento em Disco):
```bash
# Verificar consumo de memória e CPU
htop

# Verificar armazenamento em disco livre
df -h
```

### 1.2 Monitoramento de Processos (PM2)
Garanta que os processos do frontend e backend estejam saudáveis:
```bash
# Listar status de todos os processos
pm2 list

# Monitorar logs de erros em tempo real
pm2 logs
```

### 1.3 Verificação de Erros no Backend
Inspecione erros recorrentes no arquivo de logs ou saídas do console para diagnosticar falhas em integrações (ex: OpenAI API ou WhatsApp API):
```bash
pm2 logs connectmax-backend --err
```

---

## 2. Governança Financeira e SaaS Analytics

Utilize o painel estratégico administrativo em **`/admin/analytics`** para acompanhar:
- **MRR (Monthly Recurring Revenue)** e faturamento consolidado por plano.
- **Novas Assinaturas no Mês** e taxa de conversão do período de testes gratuito (Trial de 14 dias).
- **Taxas de Churn**: Monitorar motivos de cancelamento informados pelos clientes para tomada de decisões operacionais.

---

## 3. Atendimento e Suporte ao Cliente

O atendimento de chamados técnicos é feito exclusivamente pelo painel de tickets de suporte em **`/admin/support`**:
1. **Triagem**: Classifique os chamados abertos por prioridade (Baixa, Média, Alta, Urgente).
2. **Chat Técnico**: Responda aos clientes de forma ágil, utilizando o chat interno associado ao ticket.
3. **Resolução**: Altere o status do ticket para `RESOLVIDO` ou `FECHADO` após a confirmação de sucesso pelo cliente.

---

## 4. Checklist para Ativação do Primeiro Cliente Real

- [ ] **Provisionamento de Domínio**: Configurar o SSL seguro nas rotas corporativas.
- [ ] **E-mails Profissionais**: Garantir o funcionamento dos disparos automáticos via SMTP do `EmailService`.
- [ ] **Chaves de Produção**: Certificar que as credenciais do Stripe/Mercado Pago em produção estão validadas.
- [ ] **Webhooks Ativos**: Cadastrar os endpoints de webhooks correspondentes nos painéis dos gateways de pagamento.
- [ ] **Verificação de Limites**: Assegurar que as restrições e cotas do plano escolhido pelo cliente estão configuradas.
