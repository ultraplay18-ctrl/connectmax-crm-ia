import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { ChatRequestDto } from './dto/chat-request.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { CurrentUser, JwtPayloadUser } from '../common/decorators/current-user.decorator';

@Controller('ai')
@UseGuards(JwtAuthGuard, TenantGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  async chatAssistant(
    @CurrentUser() user: JwtPayloadUser,
    @Body() dto: ChatRequestDto,
  ) {
    return this.aiService.chatAssistant(user.companyId, user.userId, dto);
  }

  @Post('contacts/:id/summary')
  async generateContactSummary(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayloadUser,
  ) {
    return this.aiService.generateContactSummary(id, user.companyId, user.userId, user.role === 'SUPER_ADMIN');
  }

  @Post('leads/:id/qualify')
  async qualifyLead(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayloadUser,
  ) {
    return this.aiService.qualifyLead(id, user.companyId, user.userId, user.role === 'SUPER_ADMIN');
  }
}
