# Manual de Administração SaaS - ConnectMax CRM IA

Este manual é destinado exclusivamente ao **Super Administrador (Dono da plataforma SaaS)**.

---

## 🛡️ Accessing the Super Admin Dashboard

O acesso às funcionalidades administrativas é restrito aos usuários com perfil `SUPER_ADMIN`.

1. Faça login com a conta mestre do Super Admin.
2. No menu lateral, acesse a seção **"Painel Super Admin 🛡️"**.

---

## 📊 Indicadores Globais do SaaS (MRR)

No painel `/admin`, o gestor acompanha em tempo real:
- **Receita Recorrente Mensal (MRR)**: Cálculo automático da soma dos valores dos planos das empresas com status ativo.
- **Total de Tenants**: Quantidade de empresas cadastradas no SaaS.
- **Empresas Ativas vs Bloqueadas**: Status de acesso.
- **Distribuição de Planos**: Porcentagem de aderência dos planos **Starter**, **Professional** e **Enterprise**.

---

## 🛑 Gestão de Empresas e Bloqueios (`/admin/companies`)

Como suspender ou liberar o acesso de uma empresa cliente:

1. Acesse `/admin/companies`.
2. Utilize a barra de busca por nome, CNPJ ou e-mail.
3. Clique no botão **"Bloquear"** para suspender temporariamente o acesso por inadimplência ou violação dos termos.
4. Para alterar o plano diretamente sem cobrança manual, clique em **"Alterar Plano"** e confirme o novo nível contratado.

---

## 💾 Procedimento de Backup do Banco de Dados

Para efetuar backups preventivos do banco PostgreSQL no servidor de produção:

### Backup Manual:
```bash
docker exec -t connectmax_postgres pg_dump -U connectmax connectmax_crm_ia > backup_crm_$(date +%Y%m%d_%H%M%S).sql
```

### Restauração de Backup:
```bash
cat backup_crm_20260720.sql | docker exec -i connectmax_postgres psql -U connectmax -d connectmax_crm_ia
```
