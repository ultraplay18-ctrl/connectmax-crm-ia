import { Controller, Get, UseGuards } from '@nestjs/common';
import { AiModelsService } from '../services/ai-models.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';

@Controller('ai-studio/models')
@UseGuards(JwtAuthGuard, TenantGuard)
export class AiModelsController {
  constructor(private readonly modelsService: AiModelsService) {}

  @Get()
  async findAll() {
    return this.modelsService.findAll();
  }
}
