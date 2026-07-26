import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpdateCompanyStatusDto } from './dto/update-company-status.dto';
import { UpdateCompanyPlanDto } from './dto/update-company-plan.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser, JwtPayloadUser } from '../common/decorators/current-user.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  async getDashboardMetrics() {
    return this.adminService.getDashboardMetrics();
  }

  @Get('companies')
  async findAllCompanies(@Query('search') search?: string, @Query('status') status?: string) {
    return this.adminService.findAllCompanies(search, status);
  }

  @Get('companies/:id')
  async findOneCompany(@Param('id') id: string) {
    return this.adminService.findOneCompany(id);
  }

  @Patch('companies/:id/status')
  async updateCompanyStatus(
    @Param('id') id: string,
    @Body() dto: UpdateCompanyStatusDto,
    @CurrentUser() user: JwtPayloadUser,
  ) {
    return this.adminService.updateCompanyStatus(id, dto, user.userId);
  }

  @Patch('companies/:id/plan')
  async updateCompanyPlan(
    @Param('id') id: string,
    @Body() dto: UpdateCompanyPlanDto,
    @CurrentUser() user: JwtPayloadUser,
  ) {
    return this.adminService.updateCompanyPlan(id, dto, user.userId);
  }

  @Get('subscriptions')
  async findAllSubscriptions() {
    return this.adminService.findAllSubscriptions();
  }

  @Get('audit-logs')
  async findAllAuditLogs(@Query('search') search?: string) {
    return this.adminService.findAllAuditLogs(search);
  }

  @Get('commercial-leads')
  async findAllCommercialLeads(
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('plan') planName?: string,
  ) {
    return this.adminService.findAllCommercialLeads(search, status, planName);
  }

  @Get('commercial-leads/:id')
  async findOneCommercialLead(@Param('id') id: string) {
    return this.adminService.findOneCommercialLead(id);
  }

  @Patch('commercial-leads/:id')
  async updateCommercialLead(
    @Param('id') id: string,
    @Body() dto: { status?: string; notes?: string; responsibleId?: string },
  ) {
    return this.adminService.updateCommercialLead(id, dto);
  }

  @Post('commercial-leads/:id/convert')
  async convertLeadToClient(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayloadUser,
  ) {
    return this.adminService.convertLeadToClient(id, user.userId);
  }

  @Get('commercial-vendors')
  async findAllCommercialVendors() {
    return this.adminService.findAllCommercialVendors();
  }

  @Post('commercial-vendors')
  async createCommercialVendor(@Body() dto: { name: string; email: string; team?: string }) {
    return this.adminService.createCommercialVendor(dto);
  }

  @Get('commercial-dashboard')
  async getCommercialDashboardMetrics() {
    return this.adminService.getCommercialDashboardMetrics();
  }

  @Get('analytics/metrics')
  async getSaasAnalyticsMetrics() {
    return this.adminService.getSaasAnalyticsMetrics();
  }
}
