import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { SecretsManagerService } from '../services/secrets-manager.service';
import { CreateSecretDto } from '../dto/create-secret.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { CurrentUser, JwtPayloadUser } from '../../../common/decorators/current-user.decorator';

@Controller('ai-studio/secrets')
@UseGuards(JwtAuthGuard, TenantGuard)
export class SecretsController {
  constructor(private readonly secretsService: SecretsManagerService) {}

  @Post()
  async saveSecret(@CurrentUser() user: JwtPayloadUser, @Body() dto: CreateSecretDto) {
    return this.secretsService.saveSecret(user.companyId, dto, user.userId);
  }

  @Get()
  async getSecrets(@CurrentUser('companyId') companyId: string) {
    return this.secretsService.getSecrets(companyId);
  }

  @Delete(':keyName')
  async deleteSecret(@CurrentUser() user: JwtPayloadUser, @Param('keyName') keyName: string) {
    return this.secretsService.deleteSecret(user.companyId, keyName, user.userId);
  }

  @Get('audit')
  async getAuditLogs(@CurrentUser('companyId') companyId: string) {
    return this.secretsService.getAuditLogs(companyId);
  }
}
