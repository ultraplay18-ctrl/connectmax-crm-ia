import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { SupportService } from './support.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser, JwtPayloadUser } from '../common/decorators/current-user.decorator';

@Controller('support')
@UseGuards(JwtAuthGuard)
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  // ================= AREA DO CLIENTE =================

  @Post('tickets')
  @UseGuards(TenantGuard)
  async createTicket(
    @CurrentUser() user: JwtPayloadUser,
    @Body() dto: { subject: string; description: string; priority?: string; category?: string },
  ) {
    return this.supportService.createTicket(user.companyId, user.userId, dto);
  }

  @Get('tickets')
  @UseGuards(TenantGuard)
  async findMyTickets(@CurrentUser('companyId') companyId: string) {
    return this.supportService.findMyTickets(companyId);
  }

  @Get('tickets/:id')
  async findTicketById(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayloadUser,
  ) {
    const isSuperAdmin = user.role === 'SUPER_ADMIN';
    return this.supportService.findTicketById(id, user.companyId, isSuperAdmin);
  }

  @Post('tickets/:id/messages')
  async addTicketMessage(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayloadUser,
    @Body() dto: { message: string },
  ) {
    const isSuperAdmin = user.role === 'SUPER_ADMIN';
    return this.supportService.addTicketMessage(id, user.companyId, user.userId, dto.message, isSuperAdmin);
  }

  // ================= AREA ADMINISTRATIVA (SUPER_ADMIN) =================

  @Get('admin/tickets')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN')
  async findAllTicketsAdmin(
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
  ) {
    return this.supportService.findAllTicketsAdmin(search, status, priority);
  }

  @Patch('admin/tickets/:id')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN')
  async updateTicketAdmin(
    @Param('id') id: string,
    @Body() dto: { status?: string; priority?: string },
  ) {
    return this.supportService.updateTicketAdmin(id, dto);
  }

  @Get('admin/metrics')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN')
  async getSupportMetricsAdmin() {
    return this.supportService.getSupportMetricsAdmin();
  }
}
