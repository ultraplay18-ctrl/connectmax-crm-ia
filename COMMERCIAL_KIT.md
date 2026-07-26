# 💼 Kit Comercial e Guia de Lançamento - ConnectMax CRM IA

Este kit comercial foi projetado para equipar a equipe de marketing e vendas do ConnectMax CRM IA com as ferramentas necessárias para converter visitantes e leads em clientes pagantes.

---

## 1. Apresentação Institucional

O **ConnectMax CRM IA** é um ecossistema SaaS corporativo construído para pequenas e médias empresas que desejam escalar seu atendimento comercial. Através da fusão de um **CRM Kanban clássico**, **qualificação inteligente com IA RAG** e **Robô de WhatsApp nativo**, ajudamos equipes a organizarem seus leads sem perder oportunidades e operarem no piloto automático.

---

## 2. Argumentos de Venda e Abordagens

### Dor do Cliente vs. Solução ConnectMax:
1. **"Perdemos leads no WhatsApp por demora de resposta"**
   - *Abordagem*: O robô inteligente ConnectMax atende em até 2 segundos, qualifica e transfere apenas as oportunidades reais de fechamento (Score: HOT) para os vendedores humanos.
2. **"Os dados financeiros e de leads ficam bagunçados"**
   - *Abordagem*: CRM Financeiro e Kanban integrados de forma nativa. O fechamento de uma oportunidade no Kanban gera automaticamente as faturas e contas a receber no módulo financeiro.
3. **"Temos medo de segurança de dados em nuvem"**
   - *Abordagem*: Arquitetura de Isolamento Multi-Tenant estrita. Seus dados estão isolados no banco de dados e todas as ações dos funcionários são registradas em logs de auditoria automáticos para conformidade LGPD.

---

## 3. Diferenciais Competitivos

- **WhatsApp Nativo**: Sem necessidade de middlewares complexos ou pagamentos de chaves externas.
- **Inteligência Artificial RAG**: A IA compreende o contexto de todo o histórico do cliente no funil para emitir resumos e orientações automáticas de abordagem comercial.
- **Trial Completo de 14 Dias**: Avaliação sem atrito de 100% dos recursos do plano contratado sem exigir cartão de crédito no cadastro.

---

## 4. Onboarding Comercial do Cliente

1. **Auto-cadastro rápido**: O cliente escolhe seu plano no site (`Starter`, `Professional` ou `Enterprise`) e se cadastra em menos de 1 minuto em `/register`.
2. **Boas-vindas e Configuração Assistida (`/welcome`)**: O Setup Wizard guia o cliente pela configuração inicial em 5 passos fáceis para habilitar equipe, clientes, mensagens padrão do WhatsApp e tours visuais.
3. **Seeding Automático**: Se o cliente preferir uma avaliação prévia, disponibilizamos o usuário de testes `demo@connectmaxcrm.com` com dados de vendas, clientes e contas simuladas pré-carregadas.

---

## 5. Checklist de Preparação para o Primeiro Cliente Real

- [ ] **Ambiente de Produção**: Certificar que o banco PostgreSQL de produção e migrations estão aplicados (`npx prisma migrate deploy`).
- [ ] **SSL Ativo**: Testar redirecionamentos de HTTPS nas rotas principais e na API.
- [ ] **E-mails Transacionais**: Confirmar que o serviço de SMTP e disparos de e-mail estão configurados.
- [ ] **Gateways**: Validar as credenciais corporativas de faturamento (Stripe e Mercado Pago) e registrar os endpoints de Webhook.
- [ ] **Políticas Legais**: Verificar se as páginas `/termos`, `/politica-privacidade` e `/lgpd` estão visíveis e atualizadas.
