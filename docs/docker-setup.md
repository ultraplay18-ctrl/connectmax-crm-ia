# Guia de Execução via Docker Compose

Este documento fornece as instruções para executar o **ConnectMax CRM IA** utilizando Docker e Docker Compose.

## Pré-requisitos
- Docker Engine instalado (v20.10 ou superior)
- Docker Compose v2 instalado

## Passos para Execução

### 1. Copiar as Variáveis de Ambiente
Na raiz do monorepo, copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

### 2. Iniciar os Serviços
Execute o seguinte comando para subir o banco de dados PostgreSQL, o backend NestJS e o frontend Next.js:

```bash
docker-compose up --build -d
```

### 3. Verificar o Status dos Contêineres
```bash
docker-compose ps
```

Deverão estar em execução:
- `connectmax_postgres` na porta `5432`
- `connectmax_backend` na porta `3001`
- `connectmax_frontend` na porta `3000`

### 4. Executar Migrations e Seeds do Prisma
Para popular as Roles e Administrador padrão:

```bash
docker-compose exec backend npx prisma migrate dev --name init
docker-compose exec backend npm run seed
```

### 5. Acessar a Aplicação
- **Frontend Web**: http://localhost:3000
- **Backend API**: http://localhost:3001/api/v1
- **API Docs (Swagger)**: http://localhost:3001/api/docs

### 6. Parar os Serviços
```bash
docker-compose down
```
Para remover também os volumes do banco de dados:
```bash
docker-compose down -v
```
