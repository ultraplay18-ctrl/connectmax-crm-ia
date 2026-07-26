import { Controller, Get, UseGuards } from '@nestjs/common';
import { AiStudioDashboardService } from '../services/ai-studio-dashboard.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('ai-studio/dashboard')
@UseGuards(JwtAuthGuard, TenantGuard)
export class AiStudioDashboardController {
  constructor(private readonly dashboardService: AiStudioDashboardService) {}

  @Get()
  async getMetrics(@CurrentUser('companyId') companyId: string) {
    return this.dashboardService.getMetrics(companyId);
  }
}
