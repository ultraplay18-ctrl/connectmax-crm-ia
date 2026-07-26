import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { MemoryCenterService } from '../services/memory-center.service';
import { CreateMemoryProfileDto } from '../dto/create-memory-profile.dto';
import { CreateMemorySummaryDto } from '../dto/create-memory-summary.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { CurrentUser, JwtPayloadUser } from '../../../common/decorators/current-user.decorator';

@Controller('ai-studio/memory-center')
@UseGuards(JwtAuthGuard, TenantGuard)
export class MemoryCenterController {
  constructor(private readonly memoryService: MemoryCenterService) {}

  @Get('dashboard')
  async getDashboard(@CurrentUser('companyId') companyId: string) {
    return this.memoryService.getDashboard(companyId);
  }

  // Perfis Inteligentes
  @Post('profiles')
  async createProfile(@CurrentUser() user: JwtPayloadUser, @Body() dto: CreateMemoryProfileDto) {
    return this.memoryService.createProfile(user.companyId, dto);
  }

  @Get('profiles')
  async getProfiles(@CurrentUser('companyId') companyId: string, @Query('search') search?: string) {
    return this.memoryService.getProfiles(companyId, search);
  }

  // Conversas
  @Get('conversations')
  async getConversations(@CurrentUser('companyId') companyId: string) {
    return this.memoryService.getConversations(companyId);
  }

  // Resumos Automáticos
  @Post('summaries')
  async createSummary(@CurrentUser() user: JwtPayloadUser, @Body() dto: CreateMemorySummaryDto) {
    return this.memoryService.createSummary(user.companyId, dto);
  }

  @Get('summaries')
  async getSummaries(@CurrentUser('companyId') companyId: string, @Query('periodType') periodType?: string) {
    return this.memoryService.getSummaries(companyId, periodType);
  }

  // Memória Compartilhada
  @Get('shared')
  async getSharedMemories(@CurrentUser('companyId') companyId: string) {
    return this.memoryService.getSharedMemories(companyId);
  }
}
