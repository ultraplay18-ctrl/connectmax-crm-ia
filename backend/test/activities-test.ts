import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';
import { AuthService } from '../src/auth/auth.service';
import { ActivitiesService } from '../src/activities/activities.service';

async function testActivitiesModule() {
  console.log('========================================================');
  console.log('🧪 VALIDAÇÃO DO MÓDULO DE ATIVIDADES E AGENDA (MULTI-TENANT)');
  console.log('========================================================\n');

  let app: INestApplication;
  let prisma: PrismaService;
  let authService: AuthService;
  let activitiesService: ActivitiesService;

  try {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    authService = moduleFixture.get<AuthService>(AuthService);
    activitiesService = moduleFixture.get<ActivitiesService>(ActivitiesService);

    // Setup Tenants
    await prisma.company.deleteMany({ where: { document: { in: ['77777777000177', '88888888000188'] } } });

    const tenant1 = await authService.registerCompany({
      companyName: 'Atividades Corp 1',
      document: '77777777000177',
      companyEmail: 'atividades1@corp.com',
      adminName: 'Admin Act 1',
      adminEmail: 'admin@act1.com',
      adminPassword: 'SenhaAct1123!',
    });

    const tenant2 = await authService.registerCompany({
      companyName: 'Atividades Corp 2',
      document: '88888888000188',
      companyEmail: 'atividades2@corp.com',
      adminName: 'Admin Act 2',
      adminEmail: 'admin@act2.com',
      adminPassword: 'SenhaAct2123!',
    });

    // 1. Testar Tarefas
    const task1 = await activitiesService.createTask(
      tenant1.company.id,
      {
        title: 'Enviar proposta comercial atualizada',
        dueDate: new Date(Date.now() + 86400000).toISOString(),
        priority: 'HIGH' as any,
      },
      tenant1.user.id,
    );
    console.log(`✅ Tarefa criada para Empresa 1: "${task1.title}" (Status: ${task1.status})`);

    const updatedTask = await activitiesService.updateTask(
      task1.id,
      tenant1.company.id,
      { status: 'COMPLETED' as any },
      tenant1.user.id,
    );
    console.log(`✅ Tarefa marcada como concluída: ${updatedTask.status}`);

    // 2. Testar Interações
    const interaction1 = await activitiesService.createInteraction(
      tenant1.company.id,
      tenant1.user.id,
      {
        title: 'Ligação de alinhamento com cliente',
        type: 'CALL' as any,
        description: 'Cliente confirmou interesse no plano Enterprise.',
      },
    );
    console.log(`✅ Interação registrada para Empresa 1: [${interaction1.type}] ${interaction1.title}`);

    // 3. Testar Evento na Agenda
    const event1 = await activitiesService.createEvent(
      tenant1.company.id,
      {
        title: 'Reunião de Apresentação da Plataforma',
        startDate: new Date(Date.now() + 3600000).toISOString(),
        endDate: new Date(Date.now() + 7200000).toISOString(),
        location: 'https://meet.google.com/xyz-abc',
      },
      tenant1.user.id,
    );
    console.log(`✅ Evento de Agenda criado: "${event1.title}" em ${event1.location}`);

    // 4. Testar Isolamento Multi-tenant (Empresa 2 não enxerga tarefas/eventos da Empresa 1)
    const tasksTenant2 = await activitiesService.findAllTasks(tenant2.company.id);
    const eventsTenant2 = await activitiesService.findAllEvents(tenant2.company.id);

    console.log(`   Tarefas retornadas para Empresa 2: ${tasksTenant2.length}`);
    console.log(`   Eventos retornados para Empresa 2: ${eventsTenant2.length}`);

    if (tasksTenant2.length !== 0 || eventsTenant2.length !== 0) {
      throw new Error('❌ Falha no isolamento multi-tenant de Atividades!');
    }

    console.log('========================================================');
    console.log('🎉 MÓDULO DE ATIVIDADES E AGENDA 100% VALIDADOS!');
    console.log('========================================================\n');
  } catch (error: any) {
    console.error('\n❌ ERRO NA VALIDAÇÃO DO MÓDULO DE ATIVIDADES:', error.message || error);
    process.exit(1);
  } finally {
    if (app) {
      await app.close();
    }
  }
}

testActivitiesModule();
