import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';
import { AuthService } from '../src/auth/auth.service';
import { ContactsService } from '../src/contacts/contacts.service';

async function testContactsModule() {
  console.log('========================================================');
  console.log('🧪 VALIDAÇÃO DO MÓDULO DE CONTATOS / CLIENTES (MULTI-TENANT)');
  console.log('========================================================\n');

  let app: INestApplication;
  let prisma: PrismaService;
  let authService: AuthService;
  let contactsService: ContactsService;

  try {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    authService = moduleFixture.get<AuthService>(AuthService);
    contactsService = moduleFixture.get<ContactsService>(ContactsService);

    // 1. Setup Empresa A e Empresa B
    await prisma.company.deleteMany({ where: { document: { in: ['33333333000133', '44444444000144'] } } });

    const tenantA = await authService.registerCompany({
      companyName: 'Cliente A Corp',
      document: '33333333000133',
      companyEmail: 'contato@clientea.com',
      adminName: 'Admin Cliente A',
      adminEmail: 'admin@clientea.com',
      adminPassword: 'SenhaClienteA123!',
    });

    const tenantB = await authService.registerCompany({
      companyName: 'Cliente B S.A.',
      document: '44444444000144',
      companyEmail: 'contato@clienteb.com',
      adminName: 'Admin Cliente B',
      adminEmail: 'admin@clienteb.com',
      adminPassword: 'SenhaClienteB123!',
    });

    // 2. Criar contatos para Empresa A
    const contactA1 = await contactsService.create(
      tenantA.company.id,
      {
        name: 'Carlos Oliveira',
        email: 'carlos@empresa.com',
        phone: '(11) 98888-1111',
        type: 'INDIVIDUAL' as any,
        companyName: 'Empresa Exemplo',
        position: 'Diretor de TI',
      },
      tenantA.user.id,
    );

    console.log(`✅ Contato criado para Empresa A: ${contactA1.name} (ID: ${contactA1.id})`);

    // 3. Criar contatos para Empresa B
    const contactB1 = await contactsService.create(
      tenantB.company.id,
      {
        name: 'Mariana Santos',
        email: 'mariana@tech.com',
        phone: '(21) 97777-2222',
        type: 'COMPANY' as any,
        companyName: 'Tech Inovações',
        position: 'CEO',
      },
      tenantB.user.id,
    );

    console.log(`✅ Contato criado para Empresa B: ${contactB1.name} (ID: ${contactB1.id})`);

    // 4. Testar Listagem Isolada (Empresa A só deve ver contatos da Empresa A)
    const contactsEmpresaA = await contactsService.findAll(tenantA.company.id);
    const contactsEmpresaB = await contactsService.findAll(tenantB.company.id);

    console.log(`   Contatos retornados para Empresa A: ${contactsEmpresaA.length}`);
    console.log(`   Contatos retornados para Empresa B: ${contactsEmpresaB.length}`);

    if (contactsEmpresaA.length !== 1 || contactsEmpresaA[0].id !== contactA1.id) {
      throw new Error('❌ Falha no isolamento: Empresa A recebeu contatos incorretos!');
    }

    if (contactsEmpresaB.length !== 1 || contactsEmpresaB[0].id !== contactB1.id) {
      throw new Error('❌ Falha no isolamento: Empresa B recebeu contatos incorretos!');
    }

    console.log('   ✅ Isolamento Multi-Tenant da Tabela Contact validado com 100% de sucesso!');

    // 5. Testar Bloqueio de Acesso Cruzado (Empresa A tentando buscar contato da Empresa B por ID)
    let errorThrown = false;
    try {
      await contactsService.findOne(contactB1.id, tenantA.company.id, false);
    } catch (e: any) {
      errorThrown = true;
      console.log(`   🛡️ Bloqueio disparado ao tentar acessar contato cruzado: "${e.message}"`);
    }

    if (!errorThrown) {
      throw new Error('❌ Falha de Segurança: Empresa A conseguiu visualizar o contato da Empresa B!');
    }

    console.log('========================================================');
    console.log('🎉 MÓDULO DE CONTATOS / CLIENTES 100% VALIDADOS!');
    console.log('========================================================\n');
  } catch (error: any) {
    console.error('\n❌ ERRO NA VALIDAÇÃO DO MÓDULO DE CONTATOS:', error.message || error);
    process.exit(1);
  } finally {
    if (app) {
      await app.close();
    }
  }
}

testContactsModule();
