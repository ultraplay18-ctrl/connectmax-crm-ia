import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { KnowledgeBaseService } from '../services/knowledge-base.service';
import { CreateKnowledgeBaseDto } from '../dto/create-knowledge.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { CurrentUser, JwtPayloadUser } from '../../common/decorators/current-user.decorator';

@Controller('ai-studio/knowledge')
@UseGuards(JwtAuthGuard, TenantGuard)
export class KnowledgeBaseController {
  constructor(private readonly kbService: KnowledgeBaseService) {}

  @Post()
  async create(@CurrentUser('companyId') companyId: string, @Body() dto: CreateKnowledgeBaseDto) {
    return this.kbService.create(companyId, dto);
  }

  @Get()
  async findAll(@CurrentUser('companyId') companyId: string) {
    return this.kbService.findAll(companyId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser('companyId') companyId: string) {
    return this.kbService.findOne(id, companyId);
  }

  @Post(':id/files')
  async addFile(
    @Param('id') id: string,
    @CurrentUser('companyId') companyId: string,
    @Body() body: { name: string; fileType: string },
  ) {
    return this.kbService.addSimulatedFile(id, companyId, body.name, body.fileType);
  }

  @Post(':id/pages')
  async addPage(
    @Param('id') id: string,
    @CurrentUser('companyId') companyId: string,
    @Body() body: { url: string; title?: string },
  ) {
    return this.kbService.addSimulatedUrl(id, companyId, body.url, body.title);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser('companyId') companyId: string) {
    return this.kbService.remove(id, companyId);
  }
}
