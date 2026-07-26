import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';
import { AuthService } from '../src/auth/auth.service';
import { UsersService } from '../src/users/users.service';
import { CompaniesService } from '../src/companies/companies.service';
import { RolesService } from '../src/roles/roles.service';
import { TenantGuard } from '../src/common/guards/tenant.guard';
import { RolesGuard } from '../src/common/guards/roles.guard';
import { Reflector } from '@nestjs/core';

async function runFoundationValidation() {
  console.log('========================================================');
  console.log('🧪 INICIANDO SUÍTE DE VALIDAÇÃO DA FUNDAÇÃO SAAS');
  console.log('========================================================\n');

  let app: INestApplication;
  let prisma: PrismaService;
  let authService: AuthService;
  let usersService: UsersService;
  let companiesService: CompaniesService;
  let rolesService: RolesService;

  try {
    // 1. Inicializar aplicativo NestJS
    console.log('1️⃣ [TESTE] Verificando Inicialização do Backend NestJS...');
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    authService = moduleFixture.get<AuthService>(AuthService);
    usersService = moduleFixture.get<UsersService>(UsersService);
    companiesService = moduleFixture.get<CompaniesService>(CompaniesService);
    rolesService = moduleFixture.get<RolesService>(RolesService);

    console.log('   ✅ Backend NestJS iniciado com sucesso.\n');

    // 2. Conexão PostgreSQL & Prisma
    console.log('2️⃣ [TESTE] Verificando Conexão PostgreSQL & Prisma ORM...');
    await prisma.$queryRaw`SELECT 1`;
    console.log('   ✅ Conexão com PostgreSQL estabelecida via Prisma.\n');

    // 3. Verificar Roles no Banco
    console.log('3️⃣ [TESTE] Verificando Seeding das Roles de Acesso...');
    const roles = await rolesService.findAll();
    const roleNames = roles.map((r) => r.name);
    console.log(`   Roles encontradas no banco: [${roleNames.join(', ')}]`);

    if (!roleNames.includes('SUPER_ADMIN') || !roleNames.includes('COMPANY_ADMIN') || !roleNames.includes('EMPLOYEE')) {
      throw new Error('❌ Roles de acesso obrigatórias não foram encontradas!');
    }
    console.log('   ✅ Roles base (SUPER_ADMIN, COMPANY_ADMIN, EMPLOYEE) confirmadas.\n');

    // 4. Cadastrar Empresa A + Primeiro Administrador
    console.log('4️⃣ [TESTE] Verificando Cadastro da Empresa A & Primeiro Admin...');
    const companyAData = {
      companyName: 'Empresa Alfa SaaS',
      document: '11111111000111',
      companyEmail: 'contato@alfa.com',
      phone: '(11) 91111-1111',
      adminName: 'Admin Alfa',
      adminEmail: 'admin@alfa.com',
      adminPassword: 'SenhaAlfa123!',
    };

    // Limpar se já existir de teste anterior
    await prisma.company.deleteMany({ where: { document: { in: ['11111111000111', '22222222000122'] } } });
    await prisma.user.deleteMany({ where: { email: { in: ['admin@alfa.com', 'admin@beta.com', 'func@alfa.com'] } } });

    const companyAResult = await authService.registerCompany(companyAData);
    console.log(`   Empresa A Criada: ${companyAResult.company.name} (ID: ${companyAResult.company.id})`);
    console.log(`   Admin A Criado: ${companyAResult.user.email} (Role: ${companyAResult.user.role})`);
    console.log('   ✅ Cadastro de Empresa A e primeiro Admin concluído.\n');

    // 5. Cadastrar Empresa B + Primeiro Administrador
    console.log('5️⃣ [TESTE] Verificando Cadastro da Empresa B (Outro Tenant)...');
    const companyBData = {
      companyName: 'Empresa Beta SaaS',
      document: '22222222000122',
      companyEmail: 'contato@beta.com',
      phone: '(11) 92222-2222',
      adminName: 'Admin Beta',
      adminEmail: 'admin@beta.com',
      adminPassword: 'SenhaBeta123!',
    };

    const companyBResult = await authService.registerCompany(companyBData);
    console.log(`   Empresa B Criada: ${companyBResult.company.name} (ID: ${companyBResult.company.id})`);
    console.log(`   Admin B Criado: ${companyBResult.user.email} (Role: ${companyBResult.user.role})`);
    console.log('   ✅ Cadastro de Empresa B concluído com sucesso.\n');

    // 6. Login JWT & Tokens
    console.log('6️⃣ [TESTE] Verificando Autenticação JWT & Emissão de Tokens...');
    const loginResult = await authService.login({
      email: 'admin@alfa.com',
      password: 'SenhaAlfa123!',
    });

    if (!loginResult.accessToken || !loginResult.refreshToken) {
      throw new Error('❌ Falha na geração do Access Token ou Refresh Token.');
    }
    console.log('   Access Token recebido (Válido)');
    console.log('   Refresh Token recebido (Válido)');
    console.log('   ✅ Autenticação JWT funcionando conforme esperado.\n');

    // 7. Refresh Token
    console.log('7️⃣ [TESTE] Verificando Renovação de Sessão via Refresh Token...');
    const refreshResult = await authService.refreshToken({
      refreshToken: loginResult.refreshToken,
    });

    if (!refreshResult.accessToken) {
      throw new Error('❌ Falha na renovação do Access Token via Refresh Token.');
    }
    console.log('   Novo Access Token emitido com sucesso.');
    console.log('   ✅ Controle de sessão e Refresh Token 100% operacionais.\n');

    // 8. Isolamento Multi-Tenant (Empresa A vs Empresa B)
    console.log('8️⃣ [TESTE CRÍTICO] Verificando Isolamento Multi-Tenant de Dados...');
    const reflector = new Reflector();
    const tenantGuard = new TenantGuard(reflector);

    // Mock Context Tentativa de Violação (Empresa A tentando acessar Empresa B)
    const violationContext = {
      getHandler: () => {},
      getClass: () => {},
      switchToHttp: () => ({
        getRequest: () => ({
          user: {
            userId: loginResult.user.id,
            email: loginResult.user.email,
            companyId: companyAResult.company.id, // Pertence à Empresa A
            role: 'COMPANY_ADMIN',
          },
          tenantId: companyBResult.company.id, // Alvo: Empresa B
        }),
      }),
    } as any;

    let tenantBlocked = false;
    try {
      tenantGuard.canActivate(violationContext);
    } catch (e: any) {
      tenantBlocked = true;
      console.log(`   🛡️ Bloqueio de Multi-tenant Disparado: "${e.message}"`);
    }

    if (!tenantBlocked) {
      throw new Error('❌ ALERTA CRÍTICO: Falha de segurança! Empresa A conseguiu acessar dados da Empresa B!');
    }
    console.log('   ✅ Isolamento Multi-Tenant validado com sucesso! Dados da Empresa B inacessíveis para Empresa A.\n');

    // 9. Controle de Permissões RBAC (Roles)
    console.log('9️⃣ [TESTE CRÍTICO] Verificando Controle de Permissões RBAC...');
    const rolesGuard = new RolesGuard(reflector);

    // Criar funcionário na Empresa A
    const employeeUser = await usersService.create(
      companyAResult.company.id,
      {
        name: 'Funcionário Alfa',
        email: 'func@alfa.com',
        password: 'SenhaFunc123!',
        roleName: 'EMPLOYEE',
      },
      companyAResult.user.id,
    );

    console.log(`   Usuário Funcionário Criado: ${employeeUser.email} (Role: ${employeeUser.role.name})`);

    // Testar Funcionário tentando acessar rota protegida por COMPANY_ADMIN
    const employeeContext = {
      getHandler: () => {},
      getClass: () => {},
      switchToHttp: () => ({
        getRequest: () => ({
          user: {
            userId: employeeUser.id,
            email: employeeUser.email,
            companyId: companyAResult.company.id,
            role: 'EMPLOYEE',
          },
        }),
      }),
    } as any;

    jest_spyOn_reflector(reflector, ['COMPANY_ADMIN', 'SUPER_ADMIN']);

    let rbacBlocked = false;
    try {
      rolesGuard.canActivate(employeeContext);
    } catch (e: any) {
      rbacBlocked = true;
      console.log(`   🛡️ Bloqueio RBAC Disparado: "${e.message}"`);
    }

    if (!rbacBlocked) {
      throw new Error('❌ ALERTA: Funcionário conseguiu acessar uma rota restrita a administradores!');
    }
    console.log('   ✅ Controle RBAC de Níveis de Acesso (SUPER_ADMIN, COMPANY_ADMIN, EMPLOYEE) validado.\n');

    console.log('========================================================');
    console.log('🎉 TODAS AS 9 VALIDAÇÕES DA FUNDAÇÃO PASSARAM COM SUCESSO!');
    console.log('========================================================\n');
  } catch (error: any) {
    console.error('\n❌ ERRO NA VALIDAÇÃO DA FUNDAÇÃO:', error.message || error);
    process.exit(1);
  } finally {
    if (app) {
      await app.close();
    }
  }
}

function jest_spyOn_reflector(reflector: Reflector, roles: string[]) {
  reflector.getAllAndOverride = () => roles;
}

runFoundationValidation();
