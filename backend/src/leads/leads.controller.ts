import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { UpdateLeadStatusDto } from './dto/update-lead-status.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { CurrentUser, JwtPayloadUser } from '../common/decorators/current-user.decorator';

@Controller('leads')
@UseGuards(JwtAuthGuard, TenantGuard)
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  async create(
    @CurrentUser() user: JwtPayloadUser,
    @Body() dto: CreateLeadDto,
  ) {
    return this.leadsService.create(user.companyId, dto, user.userId);
  }

  @Get()
  async findAll(
    @CurrentUser('companyId') companyId: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('assignedUserId') assignedUserId?: string,
  ) {
    return this.leadsService.findAll(companyId, search, status, assignedUserId);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayloadUser,
  ) {
    return this.leadsService.findOne(id, user.companyId, user.role === 'SUPER_ADMIN');
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayloadUser,
    @Body() dto: UpdateLeadDto,
  ) {
    return this.leadsService.update(id, user.companyId, dto, user.userId, user.role === 'SUPER_ADMIN');
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayloadUser,
    @Body() dto: UpdateLeadStatusDto,
  ) {
    return this.leadsService.updateStatus(id, user.companyId, dto, user.userId, user.role === 'SUPER_ADMIN');
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayloadUser,
  ) {
    return this.leadsService.remove(id, user.companyId, user.userId, user.role === 'SUPER_ADMIN');
  }
}
