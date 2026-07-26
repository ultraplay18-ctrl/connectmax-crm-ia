import { IsNotEmpty, IsString } from 'class-validator';

export class SendMessageDto {
  @IsNotEmpty({ message: 'ID da conversa é obrigatório.' })
  @IsString()
  conversationId: string;

  @IsNotEmpty({ message: 'Conteúdo da mensagem é obrigatório.' })
  @IsString()
  content: string;
}
