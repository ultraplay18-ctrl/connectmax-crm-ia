import { Controller, Get, Post, Delete, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { KnowledgeHubService } from '../services/knowledge-hub.service';
import { CreateLibraryDto } from '../dto/create-library.dto';
import { CreateHubDocumentDto } from '../dto/create-hub-document.dto';
import { CreateFaqDto } from '../dto/create-faq.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { CurrentUser, JwtPayloadUser } from '../../../common/decorators/current-user.decorator';

@Controller('ai-studio/knowledge-hub')
@UseGuards(JwtAuthGuard, TenantGuard)
export class KnowledgeHubController {
  constructor(private readonly hubService: KnowledgeHubService) {}

  @Get('dashboard')
  async getDashboard(@CurrentUser('companyId') companyId: string) {
    return this.hubService.getDashboard(companyId);
  }

  // Bibliotecas
  @Post('libraries')
  async createLibrary(@CurrentUser() user: JwtPayloadUser, @Body() dto: CreateLibraryDto) {
    return this.hubService.createLibrary(user.companyId, dto);
  }

  @Get('libraries')
  async getLibraries(@CurrentUser('companyId') companyId: string) {
    return this.hubService.getLibraries(companyId);
  }

  @Delete('libraries/:id')
  async deleteLibrary(@Param('id') id: string, @CurrentUser('companyId') companyId: string) {
    return this.hubService.deleteLibrary(id, companyId);
  }

  // Documentos
  @Post('documents')
  async createDocument(@CurrentUser() user: JwtPayloadUser, @Body() dto: CreateHubDocumentDto) {
    return this.hubService.createDocument(user.companyId, dto, user.userId);
  }

  @Get('documents')
  async getDocuments(@CurrentUser('companyId') companyId: string, @Query('libraryId') libraryId?: string) {
    return this.hubService.getDocuments(companyId, libraryId);
  }

  @Patch('documents/:id/version')
  async updateDocumentVersion(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayloadUser,
    @Body('content') content: string,
    @Body('changelog') changelog?: string,
  ) {
    return this.hubService.updateDocumentVersion(id, user.companyId, content, changelog, user.userId);
  }

  // FAQs
  @Post('faqs')
  async createFaq(@CurrentUser() user: JwtPayloadUser, @Body() dto: CreateFaqDto) {
    return this.hubService.createFaq(user.companyId, dto);
  }

  @Get('faqs')
  async getFaqs(@CurrentUser('companyId') companyId: string) {
    return this.hubService.getFaqs(companyId);
  }
}
