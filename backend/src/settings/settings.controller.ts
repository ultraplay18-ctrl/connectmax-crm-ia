import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateCompanySettingsDto } from './dto/update-settings.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser, JwtPayloadUser } from '../common/decorators/current-user.decorator';

@Controller('settings')
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async getSettings(@CurrentUser('companyId') companyId: string) {
    return this.settingsService.getSettings(companyId);
  }

  @Patch()
  @Roles('SUPER_ADMIN', 'COMPANY_ADMIN')
  async updateSettings(
    @CurrentUser() user: JwtPayloadUser,
    @Body() dto: UpdateCompanySettingsDto,
  ) {
    return this.settingsService.updateSettings(user.companyId, user.userId, dto);
  }
}
