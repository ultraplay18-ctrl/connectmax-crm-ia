import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { RuntimeService } from '../services/runtime.service';
import { RuntimeRequestDto } from '../dto/runtime-request.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { CurrentUser, JwtPayloadUser } from '../../../common/decorators/current-user.decorator';

@Controller('ai-studio/runtime')
@UseGuards(JwtAuthGuard, TenantGuard)
export class RuntimeController {
  constructor(private readonly runtimeService: RuntimeService) {}

  @Post('execute')
  async execute(@CurrentUser() user: JwtPayloadUser, @Body() dto: RuntimeRequestDto) {
    return this.runtimeService.executeAgent(user.companyId, dto, user.userId);
  }

  @Get('metrics')
  async getMetrics(@CurrentUser('companyId') companyId: string) {
    return this.runtimeService.getMetrics(companyId);
  }
}
