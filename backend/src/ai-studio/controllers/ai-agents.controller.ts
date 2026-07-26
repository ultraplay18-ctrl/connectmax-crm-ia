import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AiAgentsService } from '../services/ai-agents.service';
import { CreateAgentDto } from '../dto/create-agent.dto';
import { UpdateAgentDto } from '../dto/update-agent.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { CurrentUser, JwtPayloadUser } from '../../common/decorators/current-user.decorator';

import { PromptGeneratorService, PromptBuildInputDto } from '../services/prompt-generator.service';

@Controller('ai-studio/agents')
@UseGuards(JwtAuthGuard, TenantGuard)
export class AiAgentsController {
  constructor(
    private readonly agentsService: AiAgentsService,
    private readonly promptGeneratorService: PromptGeneratorService,
  ) {}

  @Post('prompts/build')
  async buildPrompt(@Body() body: PromptBuildInputDto) {
    return this.promptGeneratorService.generatePrompt(body);
  }

  @Post()
  async create(@CurrentUser() user: JwtPayloadUser, @Body() dto: CreateAgentDto) {
    return this.agentsService.create(user.companyId, dto, user.userId);
  }

  @Get()
  async findAll(
    @CurrentUser('companyId') companyId: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('category') category?: string,
    @Query('modelName') modelName?: string,
    @Query('responsibleId') responsibleId?: string,
  ) {
    return this.agentsService.findAll(companyId, search, status, category, modelName, responsibleId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: JwtPayloadUser) {
    return this.agentsService.findOne(id, user.companyId, user.role === 'SUPER_ADMIN');
  }

  @Patch(':id')
  async update(@Param('id') id: string, @CurrentUser() user: JwtPayloadUser, @Body() dto: UpdateAgentDto) {
    return this.agentsService.update(id, user.companyId, dto, user.userId, user.role === 'SUPER_ADMIN');
  }

  @Post(':id/duplicate')
  async duplicate(@Param('id') id: string, @CurrentUser() user: JwtPayloadUser) {
    return this.agentsService.duplicate(id, user.companyId, user.userId, user.role === 'SUPER_ADMIN');
  }

  @Post(':id/archive')
  async archive(@Param('id') id: string, @CurrentUser() user: JwtPayloadUser) {
    return this.agentsService.archive(id, user.companyId, user.userId, user.role === 'SUPER_ADMIN');
  }

  @Post(':id/publish')
  async publish(@Param('id') id: string, @CurrentUser() user: JwtPayloadUser) {
    return this.agentsService.publish(id, user.companyId, user.userId, user.role === 'SUPER_ADMIN');
  }

  @Patch(':id/toggle-status')
  async toggleStatus(@Param('id') id: string, @CurrentUser() user: JwtPayloadUser) {
    return this.agentsService.toggleStatus(id, user.companyId, user.userId, user.role === 'SUPER_ADMIN');
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: JwtPayloadUser) {
    return this.agentsService.remove(id, user.companyId, user.userId, user.role === 'SUPER_ADMIN');
  }
}
