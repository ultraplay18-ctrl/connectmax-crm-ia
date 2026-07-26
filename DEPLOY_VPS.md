# 🛠️ Guia de Implantação do ConnectMax CRM IA em VPS (Ubuntu 22.04 LTS)

Este manual detalha o passo a passo completo para implantar o backend (NestJS), o frontend (Next.js) e o banco de dados (PostgreSQL) do ConnectMax CRM IA em uma VPS utilizando PM2, Nginx e Certbot (SSL gratuito).

---

## 1. Configurações Iniciais da VPS (Ubuntu 22.04)

Conecte-se ao seu servidor via SSH:
```bash
ssh root@seu_ip_vps
```

### Atualização do Sistema:
```bash
sudo apt update && sudo apt upgrade -y
```

### Instalação do Node.js (v20.x LTS) e npm:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```
Verifique a instalação:
```bash
node -v
npm -v
```

---

## 2. Instalação e Configuração do Banco de Dados PostgreSQL (Local ou Gerenciado)

Caso utilize um PostgreSQL local na VPS, instale com:
```bash
sudo apt install postgresql postgresql-contrib -y
```

### Criação do Banco de Dados e Usuário:
```bash
sudo -i -u postgres
psql
```
```sql
CREATE DATABASE connectmax;
CREATE USER crmadmin WITH PASSWORD 'sua_senha_segura';
GRANT ALL PRIVILEGES ON DATABASE connectmax TO crmadmin;
\q
exit
```

---

## 3. Configuração do Backend (NestJS)

Clone o projeto ou transfira os arquivos para a VPS:
```bash
cd /var/www
git clone https://seu-repositorio/connectmax-crm-ia.git
cd connectmax-crm-ia/backend
```

### Instalar dependências:
```bash
npm install
```

### Configurar variáveis de ambiente (`.env`):
Crie e edite o arquivo `.env`:
```bash
nano .env
```
Adicione os dados de produção:
```ini
PORT=3001
NODE_ENV=production
DATABASE_URL="postgresql://crmadmin:sua_senha_segura@localhost:5432/connectmax?sslmode=disable"
JWT_SECRET="chave_secreta_longa_gerada"
FRONTEND_URL="https://connectmaxcrm.com"
```

### Executar Migrations do Prisma:
```bash
npx prisma migrate deploy
```

### Construir e Iniciar com PM2:
```bash
npm run build
sudo npm install -g pm2
pm2 start dist/main.js --name "connectmax-backend"
pm2 save
pm2 startup
```

---

## 4. Configuração do Frontend (Next.js)

```bash
cd /var/www/connectmax-crm-ia/frontend
npm install
```

### Configurar variáveis de ambiente (`.env.production`):
```bash
nano .env.production
```
Adicione:
```ini
NEXT_PUBLIC_API_URL="https://api.connectmaxcrm.com/api/v1"
```

### Construir o Build de Produção:
```bash
npm run build
```

### Iniciar com PM2:
```bash
pm2 start npm --name "connectmax-frontend" -- start
pm2 save
```

---

## 5. Proxy Reverso Nginx e SSL (Certbot)

### Instalar Nginx:
```bash
sudo apt install nginx -y
```

### Configurar arquivo de configuração:
```bash
sudo nano /etc/nginx/sites-available/connectmax
```
Cole a configuração:
```nginx
server {
    listen 80;
    server_name connectmaxcrm.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 80;
    server_name api.connectmaxcrm.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header x-tenant-id $http_x_tenant_id;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Habilite o site e reinicie o Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/connectmax /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

### Instalar Certbot para SSL Gratuito:
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d connectmaxcrm.com -d api.connectmaxcrm.com
```

---

## 6. Checklist de Lançamento Comercial

Antes de abrir o sistema para o público, execute a seguinte validação fim a fim:
1. **Domínio e SSL**: Verifique se tanto o site principal quanto a API carregam sob protocolo HTTPS seguro.
2. **Auto-cadastro**: Realize o cadastro de uma nova empresa e verifique se o status do trial de 14 dias foi inicializado.
3. **Isolamento**: Cadastre clientes e garanta que outras empresas não conseguem acessá-los.
4. **Faturamento**: Simule faturamentos Stripe/Mercado Pago e trate os webhooks correspondentes.
5. **Backups**: Teste a geração de arquivos SQL e garanta a restauração pontual.
