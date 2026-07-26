import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser, JwtPayloadUser } from '../common/decorators/current-user.decorator';

@Controller('companies')
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @Roles('SUPER_ADMIN')
  async create(
    @Body() dto: CreateCompanyDto,
    @CurrentUser() user: JwtPayloadUser,
  ) {
    return this.companiesService.create(dto, user.userId);
  }

  @Get()
  @Roles('SUPER_ADMIN')
  async findAll() {
    return this.companiesService.findAll();
  }

  @Get('me')
  async getMyCompany(@CurrentUser('companyId') companyId: string) {
    return this.companiesService.findOne(companyId);
  }

  @Get(':id')
  @Roles('SUPER_ADMIN')
  async findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Patch('me')
  @Roles('SUPER_ADMIN', 'COMPANY_ADMIN')
  async updateMyCompany(
    @CurrentUser() user: JwtPayloadUser,
    @Body() dto: UpdateCompanyDto,
  ) {
    return this.companiesService.update(user.companyId, dto, user.userId);
  }

  @Patch(':id')
  @Roles('SUPER_ADMIN')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCompanyDto,
    @CurrentUser() user: JwtPayloadUser,
  ) {
    return this.companiesService.update(id, dto, user.userId);
  }
}
