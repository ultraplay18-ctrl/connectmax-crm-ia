# Guia de Instalação e Desenvolvimento Local - ConnectMax CRM IA

Este manual descreve o procedimento passo a passo para configurar e executar a plataforma **ConnectMax CRM IA** em seu ambiente local de desenvolvimento.

---

## 📋 Pré-requisitos

Certifique-se de ter instalado em sua máquina:
- **Node.js**: versão `v20.x` ou superior.
- **npm**: versão `v10.x` ou superior.
- **PostgreSQL**: versão `15+` (ou utilize o SQLite/Docker configurado).
- **Git**: versão recente.

---

## 🛠️ Passo 1: Clonar o Repositório

```bash
git clone https://github.com/connectmax/connectmax-crm-ia.git
cd connectmax-crm-ia
```

---

## ⚙️ Passo 2: Configuração do Backend NestJS

1. Acesse a pasta do backend:
   ```bash
   cd backend
   ```

2. Instale as dependências do Node.js:
   ```bash
   npm install
   ```

3. Configure o arquivo `.env`:
   Copie o arquivo `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```

4. Aplique as migrations no banco de dados com o Prisma:
   ```bash
   npx prisma db push
   ```

5. (Opcional) Popule o banco de dados com planos e administrador inicial:
   ```bash
   npm run seed
   ```

6. Inicie o servidor de desenvolvimento backend:
   ```bash
   npm run start:dev
   ```
   *A API estará disponível em: `http://localhost:3001/api/v1`*

---

## 🎨 Passo 3: Configuração do Frontend Next.js

1. Em um novo terminal, acesse a pasta do frontend:
   ```bash
   cd frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o arquivo `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

4. Inicie o servidor de desenvolvimento Next.js:
   ```bash
   npm run dev
   ```
   *A aplicação estará rodando em: `http://localhost:3000`*

---

## 🐳 Passo 4: Execução Alternativa com Docker Compose

Se preferir rodar toda a pilha (PostgreSQL + Backend + Frontend) com contêineres:

```bash
docker-compose up -d --build
```

Para encerrar os contêineres:
```bash
docker-compose down
```
