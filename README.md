# ConnectMax CRM IA 🚀
> Plataforma SaaS Multi-Tenant Profissional com Inteligência Artificial Interna, Atendimento WhatsApp Bot, CRM Financeiro e Assinaturas.

![ConnectMax CRM IA](https://img.shields.io/badge/SaaS-Multi--Tenant-blue.svg)
![NestJS](https://img.shields.io/badge/Backend-NestJS%20%2B%20TypeScript-red.svg)
![Next.js 14](https://img.shields.io/badge/Frontend-Next.js%2014%20App%20Router-black.svg)
![Prisma](https://img.shields.io/badge/ORM-Prisma-darkgreen.svg)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue.svg)

---

## 📌 Visão Geral do Sistema

O **ConnectMax CRM IA** é um sistema completo de gestão de relacionamento comercial para médias e grandes empresas vendida no modelo SaaS (Software as a Service). O sistema suporta múltiplos clientes (tenants) isolados com bancos de dados unificados, autenticação JWT, controle de permissões por papéis (RBAC), atendimento automatizado de WhatsApp por IA, módulo financeiro operacional e dashboard executivo do Super Administrador (dono do SaaS).

---

## 🏗️ Arquitetura Monorepo

```text
connectmax-crm-ia/
 ├── backend/            # API RESTful NestJS, Prisma ORM, Auth JWT & Integradores
 │   ├── src/
 │   │   ├── admin/      # Painel Super Admin (MRR, Tenants & Auditoria)
 │   │   ├── ai/         # Engine ConnectMax IA (Qualificação & Resumos)
 │   │   ├── auth/       # Autenticação JWT e Refresh Token
 │   │   ├── financial/  # CRM Financeiro (Contas a Receber/Pagar & Fluxo de Caixa)
 │   │   ├── leads/      # Funil de Vendas Kanban (7 Colunas)
 │   │   ├── subscriptions/# Planos Starter, Professional, Enterprise & Cotas
 │   │   └── whatsapp/   # Caixa de Entrada Multi-Agente & Bot IA
 ├── frontend/           # Next.js 14 App Router, Tailwind CSS & Dynamic UI
 │   ├── src/
 │   │   ├── app/        # Rotas da Aplicação (/dashboard, /leads, /financial, /billing, /admin)
 │   │   ├── components/ # Design System SaaS (Cards, Modais, Badges, Botões)
 │   │   └── services/   # Cliente Axios com Interceptadores JWT
 ├── docs/               # Documentação Técnica e Manuais de Operação
 ├── docker-compose.yml  # Orquestração em Contêineres (PostgreSQL, NestJS, Next.js)
 └── README.md
```

---

## 🔥 Funcionalidades Principais

1. **Arquitetura Multi-Tenant com Isolamento Estrito (`companyId`)**.
2. **Funil de Vendas Kanban Estilo HubSpot/Pipedrive (7 Colunas)**.
3. **Assistente IA Interno (Qualificação 🔥/⚠️/❄️ e Resumos de Clientes)**.
4. **Caixa de Entrada WhatsApp & Bot de Atendimento Automatizado**.
5. **CRM Financeiro Operacional (Contas a Receber/Pagar e Fluxo de Caixa)**.
6. **Planos & Assinaturas SaaS com Limites de Cotas por Tenant (`/billing`)**.
7. **Painel Super Administrador com Métrica de MRR e Controle de Bloqueio (`/admin`)**.

---

## ⚡ Inicialização Rápida em Desenvolvimento

### Pré-requisitos
- Node.js >= 20.x
- Docker & Docker Compose (Opcional)

### Execução via Docker Compose (Recomendado)
```bash
docker-compose up -d --build
```
Acesse:
- **Frontend Next.js**: `http://localhost:3000`
- **Backend API**: `http://localhost:3001/api/v1`

---

## 📚 Documentação Adicional

- 🛠️ [Guia de Instalação e Desenvolvimento Local](file:///C:/Users/e/.gemini/antigravity/scratch/connectmax-crm-ia/docs/INSTALLATION.md)
- 🚀 [Guia de Deploy em Produção (VPS / Docker / Vercel)](file:///C:/Users/e/.gemini/antigravity/scratch/connectmax-crm-ia/docs/DEPLOYMENT.md)
- 🛡️ [Manual de Administração e Operação do SaaS](file:///C:/Users/e/.gemini/antigravity/scratch/connectmax-crm-ia/docs/ADMINISTRATION.md)
