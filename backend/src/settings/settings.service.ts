import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UpdateCompanySettingsDto } from './dto/update-settings.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class SettingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async getSettings(companyId: string) {
    let settings = await this.prisma.companySettings.findUnique({
      where: { companyId },
    });

    if (!settings) {
      settings = await this.prisma.companySettings.create({
        data: {
          companyId,
          primaryColor: '#2563EB',
          timezone: 'America/Sao_Paulo',
        },
      });
    }

    return settings;
  }

  async updateSettings(companyId: string, userId: string, dto: UpdateCompanySettingsDto) {
    const existing = await this.getSettings(companyId);

    const updated = await this.prisma.companySettings.update({
      where: { companyId },
      data: {
        ...(dto.logo !== undefined && { logo: dto.logo }),
        ...(dto.primaryColor !== undefined && { primaryColor: dto.primaryColor }),
        ...(dto.timezone !== undefined && { timezone: dto.timezone }),
        ...(dto.onboardingCompleted !== undefined && { onboardingCompleted: dto.onboardingCompleted }),
        ...(dto.onboardingProgress !== undefined && { onboardingProgress: dto.onboardingProgress }),
      },
    });

    await this.auditLogsService.log({
      companyId,
      userId,
      action: 'SETTINGS_UPDATE',
      entity: 'CompanySettings',
      entityId: updated.id,
      payload: { before: existing, after: updated },
    });

    return updated;
  }
}
