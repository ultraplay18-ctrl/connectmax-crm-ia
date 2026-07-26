import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateReceivableDto } from './dto/create-receivable.dto';
import { UpdateReceivableDto } from './dto/update-receivable.dto';
import { CreatePayableDto } from './dto/create-payable.dto';
import { UpdatePayableDto } from './dto/update-payable.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class FinancialService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  // ==================== CONTAS A RECEBER ====================
  async createReceivable(companyId: string, dto: CreateReceivableDto, actorUserId?: string) {
    const receivable = await this.prisma.financialReceivable.create({
      data: {
        companyId,
        contactId: dto.contactId || null,
        leadId: dto.leadId || null,
        description: dto.description,
        amount: dto.amount,
        dueDate: new Date(dto.dueDate),
        paymentDate: dto.paymentDate ? new Date(dto.paymentDate) : null,
        status: dto.status || 'PENDING',
      },
      include: {
        contact: true,
        lead: true,
      },
    });

    await this.auditLogsService.log({
      companyId,
      userId: actorUserId,
      action: 'RECEIVABLE_CREATE',
      entity: 'FinancialReceivable',
      entityId: receivable.id,
      payload: { amount: receivable.amount, description: receivable.description },
    });

    return receivable;
  }

  async findAllReceivables(companyId: string, status?: string, contactId?: string) {
    const where: any = { companyId };
    if (status) where.status = status;
    if (contactId) where.contactId = contactId;

    return this.prisma.financialReceivable.findMany({
      where,
      include: {
        contact: true,
        lead: true,
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  async updateReceivable(id: string, companyId: string, dto: UpdateReceivableDto, actorUserId?: string, isSuperAdmin = false) {
    const existing = await this.prisma.financialReceivable.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Lançamento não encontrado.');
    if (!isSuperAdmin && existing.companyId !== companyId) {
      throw new ForbiddenException('Acesso negado: Lançamento pertence a outra empresa.');
    }

    const updated = await this.prisma.financialReceivable.update({
      where: { id },
      data: {
        ...(dto.description && { description: dto.description }),
        ...(dto.amount !== undefined && { amount: dto.amount }),
        ...(dto.dueDate && { dueDate: new Date(dto.dueDate) }),
        ...(dto.paymentDate !== undefined && { paymentDate: dto.paymentDate ? new Date(dto.paymentDate) : null }),
        ...(dto.status && { status: dto.status }),
        ...(dto.contactId !== undefined && { contactId: dto.contactId }),
        ...(dto.leadId !== undefined && { leadId: dto.leadId }),
      },
      include: {
        contact: true,
        lead: true,
      },
    });

    await this.auditLogsService.log({
      companyId,
      userId: actorUserId,
      action: 'RECEIVABLE_UPDATE',
      entity: 'FinancialReceivable',
      entityId: id,
      payload: dto,
    });

    return updated;
  }

  async deleteReceivable(id: string, companyId: string, actorUserId?: string, isSuperAdmin = false) {
    const existing = await this.prisma.financialReceivable.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Lançamento não encontrado.');
    if (!isSuperAdmin && existing.companyId !== companyId) {
      throw new ForbiddenException('Acesso negado: Lançamento pertence a outra empresa.');
    }

    await this.prisma.financialReceivable.delete({ where: { id } });
    return { message: 'Conta a receber removida com sucesso.' };
  }

  // ==================== CONTAS A PAGAR ====================
  async createPayable(companyId: string, dto: CreatePayableDto, actorUserId?: string) {
    const payable = await this.prisma.financialPayable.create({
      data: {
        companyId,
        supplier: dto.supplier,
        category: dto.category,
        description: dto.description,
        amount: dto.amount,
        dueDate: new Date(dto.dueDate),
        paymentDate: dto.paymentDate ? new Date(dto.paymentDate) : null,
        status: dto.status || 'PENDING',
      },
    });

    await this.auditLogsService.log({
      companyId,
      userId: actorUserId,
      action: 'PAYABLE_CREATE',
      entity: 'FinancialPayable',
      entityId: payable.id,
      payload: { supplier: payable.supplier, amount: payable.amount },
    });

    return payable;
  }

  async findAllPayables(companyId: string, status?: string, category?: string) {
    const where: any = { companyId };
    if (status) where.status = status;
    if (category) where.category = category;

    return this.prisma.financialPayable.findMany({
      where,
      orderBy: { dueDate: 'asc' },
    });
  }

  async updatePayable(id: string, companyId: string, dto: UpdatePayableDto, actorUserId?: string, isSuperAdmin = false) {
    const existing = await this.prisma.financialPayable.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Lançamento não encontrado.');
    if (!isSuperAdmin && existing.companyId !== companyId) {
      throw new ForbiddenException('Acesso negado: Lançamento pertence a outra empresa.');
    }

    const updated = await this.prisma.financialPayable.update({
      where: { id },
      data: {
        ...(dto.supplier && { supplier: dto.supplier }),
        ...(dto.category && { category: dto.category }),
        ...(dto.description && { description: dto.description }),
        ...(dto.amount !== undefined && { amount: dto.amount }),
        ...(dto.dueDate && { dueDate: new Date(dto.dueDate) }),
        ...(dto.paymentDate !== undefined && { paymentDate: dto.paymentDate ? new Date(dto.paymentDate) : null }),
        ...(dto.status && { status: dto.status }),
      },
    });

    await this.auditLogsService.log({
      companyId,
      userId: actorUserId,
      action: 'PAYABLE_UPDATE',
      entity: 'FinancialPayable',
      entityId: id,
      payload: dto,
    });

    return updated;
  }

  async deletePayable(id: string, companyId: string, actorUserId?: string, isSuperAdmin = false) {
    const existing = await this.prisma.financialPayable.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Lançamento não encontrado.');
    if (!isSuperAdmin && existing.companyId !== companyId) {
      throw new ForbiddenException('Acesso negado: Lançamento pertence a outra empresa.');
    }

    await this.prisma.financialPayable.delete({ where: { id } });
    return { message: 'Conta a pagar removida com sucesso.' };
  }

  // ==================== DASHBOARD & FLUXO DE CAIXA ====================
  async getFinancialSummary(companyId: string) {
    const [receivables, payables] = await Promise.all([
      this.prisma.financialReceivable.findMany({ where: { companyId } }),
      this.prisma.financialPayable.findMany({ where: { companyId } }),
    ]);

    const totalReceivablesPaid = receivables
      .filter((r) => r.status === 'PAID')
      .reduce((acc, r) => acc + r.amount, 0);

    const totalPayablesPaid = payables
      .filter((p) => p.status === 'PAID')
      .reduce((acc, p) => acc + p.amount, 0);

    const netBalance = totalReceivablesPaid - totalPayablesPaid;

    const totalPendingReceivables = receivables
      .filter((r) => r.status === 'PENDING')
      .reduce((acc, r) => acc + r.amount, 0);

    const totalOverdueReceivables = receivables
      .filter((r) => r.status === 'OVERDUE')
      .reduce((acc, r) => acc + r.amount, 0);

    const totalPendingPayables = payables
      .filter((p) => p.status === 'PENDING')
      .reduce((acc, p) => acc + p.amount, 0);

    return {
      totalReceivablesPaid,
      totalPayablesPaid,
      netBalance,
      totalPendingReceivables,
      totalOverdueReceivables,
      totalPendingPayables,
      receivablesCount: receivables.length,
      payablesCount: payables.length,
    };
  }
}
