import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser, JwtPayloadUser } from '../common/decorators/current-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles('SUPER_ADMIN', 'COMPANY_ADMIN')
  async create(
    @CurrentUser() user: JwtPayloadUser,
    @Body() dto: CreateUserDto,
  ) {
    return this.usersService.create(user.companyId, dto, user.userId);
  }

  @Get()
  @Roles('SUPER_ADMIN', 'COMPANY_ADMIN')
  async findAll(@CurrentUser() user: JwtPayloadUser) {
    const isSuperAdmin = user.role === 'SUPER_ADMIN';
    return this.usersService.findAllByCompany(user.companyId, isSuperAdmin);
  }

  @Get('me')
  async getProfile(@CurrentUser() user: JwtPayloadUser) {
    return this.usersService.findOne(user.userId, user.companyId, user.role === 'SUPER_ADMIN');
  }

  @Get(':id')
  @Roles('SUPER_ADMIN', 'COMPANY_ADMIN')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayloadUser,
  ) {
    return this.usersService.findOne(id, user.companyId, user.role === 'SUPER_ADMIN');
  }

  @Patch('me')
  async updateProfile(
    @CurrentUser() user: JwtPayloadUser,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.update(user.userId, dto, user.companyId, user.userId, user.role === 'SUPER_ADMIN');
  }

  @Patch(':id')
  @Roles('SUPER_ADMIN', 'COMPANY_ADMIN')
  async update(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayloadUser,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.update(id, dto, user.companyId, user.userId, user.role === 'SUPER_ADMIN');
  }
}
