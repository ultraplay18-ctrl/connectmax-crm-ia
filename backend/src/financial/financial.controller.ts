import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { FinancialService } from './financial.service';
import { CreateReceivableDto } from './dto/create-receivable.dto';
import { UpdateReceivableDto } from './dto/update-receivable.dto';
import { CreatePayableDto } from './dto/create-payable.dto';
import { UpdatePayableDto } from './dto/update-payable.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { CurrentUser, JwtPayloadUser } from '../common/decorators/current-user.decorator';

@Controller('financial')
@UseGuards(JwtAuthGuard, TenantGuard)
export class FinancialController {
  constructor(private readonly financialService: FinancialService) {}

  // ==================== METRICAS E RESUMO ====================
  @Get('summary')
  async getSummary(@CurrentUser('companyId') companyId: string) {
    return this.financialService.getFinancialSummary(companyId);
  }

  // ==================== CONTAS A RECEBER ====================
  @Post('receivables')
  async createReceivable(@CurrentUser() user: JwtPayloadUser, @Body() dto: CreateReceivableDto) {
    return this.financialService.createReceivable(user.companyId, dto, user.userId);
  }

  @Get('receivables')
  async findAllReceivables(
    @CurrentUser('companyId') companyId: string,
    @Query('status') status?: string,
    @Query('contactId') contactId?: string,
  ) {
    return this.financialService.findAllReceivables(companyId, status, contactId);
  }

  @Patch('receivables/:id')
  async updateReceivable(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayloadUser,
    @Body() dto: UpdateReceivableDto,
  ) {
    return this.financialService.updateReceivable(id, user.companyId, dto, user.userId, user.role === 'SUPER_ADMIN');
  }

  @Delete('receivables/:id')
  async deleteReceivable(@Param('id') id: string, @CurrentUser() user: JwtPayloadUser) {
    return this.financialService.deleteReceivable(id, user.companyId, user.userId, user.role === 'SUPER_ADMIN');
  }

  // ==================== CONTAS A PAGAR ====================
  @Post('payables')
  async createPayable(@CurrentUser() user: JwtPayloadUser, @Body() dto: CreatePayableDto) {
    return this.financialService.createPayable(user.companyId, dto, user.userId);
  }

  @Get('payables')
  async findAllPayables(
    @CurrentUser('companyId') companyId: string,
    @Query('status') status?: string,
    @Query('category') category?: string,
  ) {
    return this.financialService.findAllPayables(companyId, status, category);
  }

  @Patch('payables/:id')
  async updatePayable(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayloadUser,
    @Body() dto: UpdatePayableDto,
  ) {
    return this.financialService.updatePayable(id, user.companyId, dto, user.userId, user.role === 'SUPER_ADMIN');
  }

  @Delete('payables/:id')
  async deletePayable(@Param('id') id: string, @CurrentUser() user: JwtPayloadUser) {
    return this.financialService.deletePayable(id, user.companyId, user.userId, user.role === 'SUPER_ADMIN');
  }
}
