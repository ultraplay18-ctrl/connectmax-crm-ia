import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { SimulateIncomingDto } from './dto/simulate-incoming.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { TransferConversationDto } from './dto/transfer-conversation.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { CurrentUser, JwtPayloadUser } from '../common/decorators/current-user.decorator';

@Controller('whatsapp')
@UseGuards(JwtAuthGuard, TenantGuard)
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Post('simulate')
  async simulateIncoming(
    @CurrentUser('companyId') companyId: string,
    @Body() dto: SimulateIncomingDto,
  ) {
    return this.whatsappService.simulateIncomingMessage(companyId, dto);
  }

  @Post('send')
  async sendMessage(
    @CurrentUser() user: JwtPayloadUser,
    @Body() dto: SendMessageDto,
  ) {
    return this.whatsappService.sendMessage(user.companyId, user.userId, dto);
  }

  @Patch('transfer')
  async transferConversation(
    @CurrentUser() user: JwtPayloadUser,
    @Body() dto: TransferConversationDto,
  ) {
    return this.whatsappService.transferConversation(user.companyId, user.userId, dto);
  }

  @Get('conversations')
  async findAllConversations(
    @CurrentUser('companyId') companyId: string,
    @Query('status') status?: string,
  ) {
    return this.whatsappService.findAllConversations(companyId, status);
  }

  @Get('conversations/:id')
  async findOneConversation(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayloadUser,
  ) {
    return this.whatsappService.findOneConversation(id, user.companyId, user.role === 'SUPER_ADMIN');
  }
}
