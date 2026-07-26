# 🚀 Manual de Instalação, Deploy e Administração - ConnectMax CRM IA

Este guia descreve os requisitos, procedimentos de implantação, backups e governança administrativa para colocar o ecossistema SaaS do ConnectMax CRM IA no ar em servidores de produção.

---

## 1. Requisitos de Infraestrutura e Servidor

### Requisitos Mínimos Recomendados:
- **Backend (NestJS)**: Instância de VPS (AWS EC2, DigitalOcean Droplet ou Hetzner) com 2 vCPUs, 4GB RAM e Node.js 20 LTS+.
- **Frontend (Next.js)**: Implantação recomendada via Vercel ou VPS separada (1 vCPU, 2GB RAM).
- **Banco de Dados (PostgreSQL)**: Servidor gerenciado (AWS RDS, Supabase ou Neon) rodando PostgreSQL 15+.
- **Serviços Adicionais**:
  - Redis (para filas de envio do WhatsApp e controle de concorrência).
  - Conta Meta Developers App (para API oficial de WhatsApp Cloud).
  - Contas corporativas no **Stripe** e **Mercado Pago** para faturamento SaaS.

---

## 2. Configurações de Variáveis de Ambiente (.env)

Configure as seguintes chaves sensíveis nos painéis de deploy do frontend e backend.

### Backend (`.env` de Produção):
```ini
# Core
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://connectmaxcrm.com

# Banco de Dados PostgreSQL
DATABASE_URL="postgresql://usuario:senha@host:5432/connectmax?sslmode=require"

# Segurança e Autenticação JWT
JWT_SECRET="sua-chave-secreta-e-longa-gerada-com-openssl"
JWT_EXPIRES_IN="24h"

# Gateways de Faturamento
STRIPE_SECRET_KEY="sk_prod_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
MERCADOPAGO_ACCESS_TOKEN="APP_USR-..."
MERCADOPAGO_WEBHOOK_SECRET="mp_wh_..."

# OpenAI API (Inteligência Artificial)
OPENAI_API_KEY="sk-proj-..."
```

### Frontend (`.env.production`):
```ini
# Endpoint do Backend
NEXT_PUBLIC_API_URL=https://api.connectmaxcrm.com/api/v1
```

---

## 3. Configurações do Banco de Dados PostgreSQL

### Migrations de Produção
Para aplicar os modelos do Prisma e gerar as tabelas relacionais no PostgreSQL de produção, execute:
```bash
npx prisma migrate deploy
```

### Script de Backup Automático (Cron Diário)
Recomenda-se configurar uma rotina cron diária na VPS do banco ou executar um script Shell agendado para salvamento de backups em nuvem (S3):

```bash
#!/bin/bash
# Script: backup_postgres.sh
DB_NAME="connectmax"
BACKUP_DIR="/var/backups/connectmax"
DATE=$(date +%Y-%m-%d_%H%M%S)

pg_dump -H "host" -U "usuario" -F c -b -v -f "$BACKUP_DIR/$DB_NAME-$DATE.backup"
# Enviar para bucket AWS S3 seguro
aws s3 cp "$BACKUP_DIR/$DB_NAME-$DATE.backup" s3://backups-connectmax/db/
```

### Restauração do Banco de Dados (Restore)
Para recuperar um ponto de restauração no PostgreSQL:
```bash
pg_restore -H "host" -U "usuario" -d "connectmax" -v "/var/backups/connectmax/seu-backup.backup"
```

---

## 4. Domínio, SSL e Nginx Reverse Proxy

### Apontamentos DNS:
- `connectmaxcrm.com` -> IP do servidor Next.js.
- `api.connectmaxcrm.com` -> IP da VPS NestJS.

### Nginx Config (Reverse Proxy com Certbot SSL):
```nginx
server {
    server_name api.connectmaxcrm.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header x-tenant-id $http_x_tenant_id;
    }

    listen 443 ssl; # Managed by Certbot
    ssl_certificate /etc/letsencrypt/live/api.connectmaxcrm.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.connectmaxcrm.com/privkey.pem;
}
```

---

## 5. Manual Administrativo do SaaS (SUPER_ADMIN)

O painel global administrativo (`/admin`) permite ao operador da plataforma ConnectMax:
1. **Analytics SaaS (`/admin/analytics`)**: Monitorar MRR, ARR, novos clientes e taxas de Churn e cancelamentos.
2. **CRM Comercial (`/admin/commercial-sales`)**: Gerenciar funil de leads do SaaS, qualificar com IA e usar o botão "Converter em Cliente" para provisionar o tenant do cliente automaticamente.
3. **Tickets de Suporte (`/admin/support`)**: Resolver e responder chamados de clientes.

---

## 6. Manual do Cliente SaaS (Área do Cliente)

1. **Auto-cadastro**: O cliente acessa `/register?plan=Professional`, informa os dados de empresa (CNPJ, telefone) e cria a conta ganhando 14 dias de Trial automático.
2. **Onboarding Wizard**: Ao logar pela primeira vez, o cliente é guiado pelo assistente `/welcome` em 5 passos rápidos para configurar equipe, importar planilhas e testar a IA comercial.
3. **Faturamento (`/billing`)**: Pelo painel do cliente, é possível gerenciar cartões, acompanhar o status da assinatura (`TRIAL_ACTIVE`, `ACTIVE`, `EXPIRED`) e efetuar upgrades via gateways de pagamento.
