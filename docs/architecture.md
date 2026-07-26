# Arquitetura do ConnectMax CRM IA

## 1. Visão Geral
O **ConnectMax CRM IA** é uma plataforma SaaS profissional **Multi-tenant** projetada para garantir total isolamento de dados entre empresas, com autenticação JWT, controle de acesso baseado em funções (RBAC) e logs de auditoria detalhados.

```
                     ┌──────────────────────────────┐
                     │   Next.js Frontend (3000)    │
                     └──────────────┬───────────────┘
                                    │ HTTP / REST API
                                    ▼
                     ┌──────────────────────────────┐
                     │    NestJS Backend (3001)     │
                     └──────────────┬───────────────┘
                                    │
           ┌────────────────────────┼────────────────────────┐
           ▼                        ▼                        ▼
┌────────────────────┐   ┌────────────────────┐   ┌────────────────────┐
│ TenantMiddleware   │   │    JwtAuthGuard    │   │     AuditLog       │
│ & TenantGuard      │   │    & RolesGuard    │   │    Interceptor     │
└────────────────────┘   └────────────────────┘   └────────────────────┘
                                    │
                                    ▼ Prisma ORM
                     ┌──────────────────────────────┐
                     │   PostgreSQL Database (5432) │
                     └──────────────────────────────┘
```

## 2. Estrutura de Multi-Tenancy (Isolamento de Dados)
- Cada empresa cadastrada possui um `companyId` único no formato UUID.
- Todas as entidades filhas do tenant (`User`, `CompanySettings`, futuros módulos como Clientes, Leads, Oportunidades, Faturas) possuem uma chave estrangeira obrigatória `companyId`.
- **TenantMiddleware**: Captura e valida o `companyId` presente no payload do token JWT decodificado ou no header `x-tenant-id`.
- **TenantGuard**: Assegura que rotas marcadas como protegidas por Tenant rejeitem requisições de usuários tentando acessar dados de tenants aos quais não pertencem.
- **TenantInterceptor**: Aplica dinamicamente filtros `where: { companyId }` nas consultas do Prisma para evitar vazamentos acidentais.

## 3. Sistema de Controle de Acesso (RBAC)
Existem 3 níveis de acesso padrão no sistema:
1. **SUPER_ADMIN**: Dono da plataforma ConnectMax. Pode criar/gerenciar empresas, visualizar logs globais e gerenciar o sistema.
2. **COMPANY_ADMIN**: Administrador da empresa cliente. Pode gerenciar os usuários da própria empresa, alterar configurações visuais e preferências.
3. **EMPLOYEE**: Funcionário da empresa cliente. Utiliza os módulos operacionais com permissões limitadas.

## 4. Auditoria e Segurança
- **AuditLog**: Todas as ações críticas (Criação de usuários, alterações de senha, mudanças de configurações, acessos administrativos) geram registros imutáveis na tabela `AuditLog`.
- **Session Management**: O token JWT possui tempo de vida curto e é acompanhado de um `refreshToken` revogável armazenado no banco de dados na tabela `Session`.
