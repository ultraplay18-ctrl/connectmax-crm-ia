import { Controller, Get, UseGuards } from '@nestjs/common';
import { AiToolsService } from '../services/ai-tools.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';

@Controller('ai-studio/tools')
@UseGuards(JwtAuthGuard, TenantGuard)
export class AiToolsController {
  constructor(private readonly toolsService: AiToolsService) {}

  @Get()
  async findAll() {
    return this.toolsService.findAll();
  }
}
