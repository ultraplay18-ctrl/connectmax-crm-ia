import { Controller, Get, Post, Patch, Body, UseGuards } from '@nestjs/common';
import { ProviderManagerService } from '../services/provider-manager.service';
import { UpdateProviderConfigDto } from '../dto/update-provider-config.dto';
import { UpdateFallbackChainDto } from '../dto/update-fallback-chain.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { CurrentUser, JwtPayloadUser } from '../../../common/decorators/current-user.decorator';

@Controller('ai-studio/providers')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ProvidersController {
  constructor(private readonly providerService: ProviderManagerService) {}

  @Get('dashboard')
  async getDashboard(@CurrentUser('companyId') companyId: string) {
    return this.providerService.getDashboard(companyId);
  }

  @Get()
  async getProviders(@CurrentUser('companyId') companyId: string) {
    return this.providerService.getProviders(companyId);
  }

  @Patch('config')
  async updateProvider(@CurrentUser('companyId') companyId: string, @Body() dto: UpdateProviderConfigDto) {
    return this.providerService.updateProvider(companyId, dto);
  }

  @Get('fallback')
  async getFallbackChain(@CurrentUser('companyId') companyId: string) {
    return this.providerService.getFallbackChain(companyId);
  }

  @Post('fallback')
  async updateFallbackChain(@CurrentUser('companyId') companyId: string, @Body() dto: UpdateFallbackChainDto) {
    return this.providerService.updateFallbackChain(companyId, dto);
  }
}
