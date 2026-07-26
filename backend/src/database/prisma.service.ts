import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
    await this.seedDemoData();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  private async seedDemoData() {
    // 1. Roles
    let superAdminRole = await this.role.findUnique({ where: { name: 'SUPER_ADMIN' } });
    if (!superAdminRole) {
      superAdminRole = await this.role.create({
        data: {
          name: 'SUPER_ADMIN',
          description: 'Administrador global do SaaS',
          permissions: JSON.stringify({ manageAll: true }),
        },
      });
    }

    let companyAdminRole = await this.role.findUnique({ where: { name: 'COMPANY_ADMIN' } });
    if (!companyAdminRole) {
      companyAdminRole = await this.role.create({
        data: {
          name: 'COMPANY_ADMIN',
          description: 'Administrador da empresa cliente',
          permissions: JSON.stringify({ manageUsers: true, manageSettings: true }),
        },
      });
    }

    let userRole = await this.role.findUnique({ where: { name: 'USER' } });
    if (!userRole) {
      userRole = await this.role.create({
        data: {
          name: 'USER',
          description: 'Usuário padrão',
          permissions: JSON.stringify({ viewLeads: true }),
        },
      });
    }

    // 2. Plans
    let starterPlan = await this.plan.findUnique({ where: { name: 'Starter' } });
    if (!starterPlan) {
      starterPlan = await this.plan.create({
        data: {
          name: 'Starter',
          price: 99,
          maxUsers: 3,
          maxContacts: 500,
          billingCycle: 'MONTHLY',
        },
      });
    }

    let proPlan = await this.plan.findUnique({ where: { name: 'Professional' } });
    if (!proPlan) {
      proPlan = await this.plan.create({
        data: {
          name: 'Professional',
          price: 299,
          maxUsers: 10,
          maxContacts: 5000,
          billingCycle: 'MONTHLY',
        },
      });
    }

    let entPlan = await this.plan.findUnique({ where: { name: 'Enterprise' } });
    if (!entPlan) {
      entPlan = await this.plan.create({
        data: {
          name: 'Enterprise',
          price: 799,
          maxUsers: -1,
          maxContacts: -1,
          billingCycle: 'MONTHLY',
        },
      });
    }

    // 3. Demo User & Company
    const demoEmail = 'demo@connectmaxcrm.com';
    const existingDemoUser = await this.user.findFirst({
      where: { email: demoEmail },
    });

    if (!existingDemoUser) {
      const passwordHash = await require('bcrypt').hash('DemoConnectMax123!', 10);
      
      const company = await this.company.create({
        data: {
          name: 'ConnectMax Demo S.A.',
          document: '00000000000000',
          email: 'demo@connectmaxcrm.com',
          phone: '(11) 99999-9999',
          status: 'ACTIVE',
          settings: {
            create: {
              primaryColor: '#2563EB',
              timezone: 'America/Sao_Paulo',
              onboardingCompleted: true,
              onboardingProgress: 5,
            },
          },
        },
      });

      const user = await this.user.create({
        data: {
          companyId: company.id,
          roleId: companyAdminRole.id,
          name: 'Cliente Demo',
          email: demoEmail,
          password: passwordHash,
          status: 'ACTIVE',
        },
      });

      // Create initial subscription for the demo company
      const trialEnds = new Date();
      trialEnds.setDate(trialEnds.getDate() + 14);

      await this.subscription.create({
        data: {
          companyId: company.id,
          planId: proPlan.id,
          status: 'TRIAL_ACTIVE',
          isTrial: true,
          trialEndsAt: trialEnds,
          startDate: new Date(),
          nextBillingDate: trialEnds,
          paymentProvider: 'SIMULATED',
        },
      });

      // Seed Clients (Contacts)
      const contact1 = await this.contact.create({
        data: {
          companyId: company.id,
          name: 'Acme Corporativa',
          email: 'contato@acme.com',
          phone: '(11) 98888-1111',
          status: 'ACTIVE',
        },
      });

      const contact2 = await this.contact.create({
        data: {
          companyId: company.id,
          name: 'Inova Digital',
          email: 'vendas@inova.com',
          phone: '(21) 97777-2222',
          status: 'ACTIVE',
        },
      });

      // Seed Leads (Kanban Opportunities)
      await this.lead.create({
        data: {
          companyId: company.id,
          contactId: contact1.id,
          assignedUserId: user.id,
          title: 'Implantação de Redes',
          value: 12500,
          status: 'NEW_LEAD',
        },
      });

      await this.lead.create({
        data: {
          companyId: company.id,
          contactId: contact2.id,
          assignedUserId: user.id,
          title: 'Consultoria Mensal',
          value: 4500,
          status: 'PROPOSAL_SENT',
        },
      });

      // Seed Financials
      await this.financialReceivable.create({
        data: {
          companyId: company.id,
          contactId: contact1.id,
          description: 'Serviço Acme Redes',
          amount: 12500,
          dueDate: new Date(),
          status: 'PENDING',
        },
      });

      await this.financialPayable.create({
        data: {
          companyId: company.id,
          supplier: 'Meta API Services',
          category: 'Infraestrutura',
          description: 'Tarifa WhatsApp Business',
          amount: 450,
          dueDate: new Date(),
          status: 'PENDING',
        },
      });
    }
  }
}
