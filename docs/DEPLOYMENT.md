# Guia de Deploy em Produção - ConnectMax CRM IA

Este guia orienta o processo de implantação em ambiente de produção (Cloud/VPS) do **ConnectMax CRM IA**.

---

## ☁️ Opção 1: Deploy em VPS Linux (Ubuntu / Debian com Docker)

Esta é a opção recomendada para manter o controle total do banco de dados PostgreSQL e dos contêineres do backend e frontend.

### 1. Preparação da VPS

Acesse sua VPS via SSH e instale o Docker e o Docker Compose:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose git
```

### 2. Configuração do Projeto

1. Clone o repositório na VPS:
   ```bash
   git clone https://github.com/connectmax/connectmax-crm-ia.git /var/www/connectmax-crm-ia
   cd /var/www/connectmax-crm-ia
   ```

2. Crie o arquivo `.env` na raiz ou edite os `.env` do backend e frontend com credenciais reais de produção:
   ```bash
   nano backend/.env
   ```
   *Certifique-se de alterar `JWT_SECRET`, `JWT_REFRESH_SECRET` e senhas do PostgreSQL.*

3. Inicie os serviços em segundo plano:
   ```bash
   docker-compose up -d --build
   ```

---

## ⚡ Opção 2: Deploy Híbrido (Vercel + Railway / Render)

Se optar por utilizar plataformas PaaS sem gerenciar servidores:

### 1. Backend NestJS & PostgreSQL (Railway ou Render)
- Crie um serviço PostgreSQL Managed no Railway.
- Conecte o repositório `/backend` e defina a variável `DATABASE_URL`.
- Execute a geração do Prisma no Build Command: `npx prisma db push && npm run build`.
- Start Command: `node dist/main.js`.

### 2. Frontend Next.js (Vercel)
- Importe o repositório `/frontend` no painel da Vercel.
- Configure a variável de ambiente:
  `NEXT_PUBLIC_API_URL=https://api-sua-empresa.up.railway.app/api/v1`
- Clique em **Deploy**.

---

## 🔒 Certificado SSL (HTTPS) com Nginx & Certbot

Caso utilize VPS, configure o Nginx como Proxy Reverso com SSL gratuito via Let's Encrypt:

```nginx
server {
    server_name app.seu-crm.com.br;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

server {
    server_name api.seu-crm.com.br;

    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Gerar certificado com Certbot:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d app.seu-crm.com.br -d api.seu-crm.com.br
```
