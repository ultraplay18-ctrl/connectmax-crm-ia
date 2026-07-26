import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class TransferConversationDto {
  @IsNotEmpty({ message: 'ID da conversa é obrigatório.' })
  @IsString()
  conversationId: string;

  @IsOptional()
  @IsString()
  assignedUserId?: string;

  @IsOptional()
  @IsString()
  status?: string; // HUMAN_ATTENDING, CLOSED, AI_ATTENDING
}
