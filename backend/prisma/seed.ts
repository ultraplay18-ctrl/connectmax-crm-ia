import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando Seed do Banco de Dados ConnectMax CRM IA...');

  // 1. Criar Roles padrão
  const roles = [
    {
      name: 'SUPER_ADMIN',
      description: 'Dono da plataforma ConnectMax. Acesso global e irrestrito.',
      permissions: {
        all: true,
        manageCompanies: true,
        manageGlobalSettings: true,
      },
    },
    {
      name: 'COMPANY_ADMIN',
      description: 'Administrador da empresa cliente. Gerencia usuários e preferências.',
      permissions: {
        manageUsers: true,
        manageSettings: true,
        viewReports: true,
      },
    },
    {
      name: 'EMPLOYEE',
      description: 'Funcionário da empresa cliente. Acesso aos módulos operacionais liberados.',
      permissions: {
        useModules: true,
      },
    },
  ];

  for (const roleData of roles) {
    const formattedData = {
      ...roleData,
      permissions: typeof roleData.permissions === 'object' ? JSON.stringify(roleData.permissions) : roleData.permissions,
    };
    await prisma.role.upsert({
      where: { name: roleData.name },
      update: {
        description: formattedData.description,
        permissions: formattedData.permissions,
      },
      create: formattedData,
    });
    console.log(`✅ Role ${roleData.name} criada/atualizada com sucesso.`);
  }

  // 2. Criar Empresa Padrão (ConnectMax HQ)
  const superAdminCompany = await prisma.company.upsert({
    where: { document: '00000000000100' },
    update: {},
    create: {
      name: 'ConnectMax HQ',
      document: '00000000000100',
      email: 'admin@connectmax.com.br',
      phone: '(11) 99999-9999',
      status: 'ACTIVE',
      settings: {
        create: {
          primaryColor: '#0F172A',
          timezone: 'America/Sao_Paulo',
        },
      },
    },
  });

  console.log(`✅ Empresa matriz ConnectMax HQ pronta ID: ${superAdminCompany.id}`);

  // 3. Criar Super Admin padrão
  const superAdminRole = await prisma.role.findUnique({ where: { name: 'SUPER_ADMIN' } });

  if (superAdminRole) {
    const passwordHash = await bcrypt.hash('Admin123!', 10);
    const superAdminUser = await prisma.user.upsert({
      where: { email: 'admin@connectmax.com.br' },
      update: {},
      create: {
        companyId: superAdminCompany.id,
        roleId: superAdminRole.id,
        name: 'Super Administrador ConnectMax',
        email: 'admin@connectmax.com.br',
        password: passwordHash,
        status: 'ACTIVE',
      },
    });

    console.log(`✅ Usuário Super Admin pronto: ${superAdminUser.email} (Senha: Admin123!)`);
  }

  console.log('🎉 Seed finalizado com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
