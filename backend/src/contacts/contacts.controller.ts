import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { CurrentUser, JwtPayloadUser } from '../common/decorators/current-user.decorator';

@Controller('contacts')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  async create(
    @CurrentUser() user: JwtPayloadUser,
    @Body() dto: CreateContactDto,
  ) {
    return this.contactsService.create(user.companyId, dto, user.userId);
  }

  @Get()
  async findAll(
    @CurrentUser('companyId') companyId: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.contactsService.findAll(companyId, search, status);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayloadUser,
  ) {
    return this.contactsService.findOne(id, user.companyId, user.role === 'SUPER_ADMIN');
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayloadUser,
    @Body() dto: UpdateContactDto,
  ) {
    return this.contactsService.update(id, user.companyId, dto, user.userId, user.role === 'SUPER_ADMIN');
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayloadUser,
  ) {
    return this.contactsService.remove(id, user.companyId, user.userId, user.role === 'SUPER_ADMIN');
  }
}
