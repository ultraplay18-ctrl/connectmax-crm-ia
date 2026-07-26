import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class RuntimeRequestDto {
  @IsString()
  @IsNotEmpty({ message: 'O ID do agente é obrigatório' })
  agentId: string;

  @IsString()
  @IsNotEmpty({ message: 'A mensagem de entrada é obrigatória' })
  input: string;

  @IsString()
  @IsOptional()
  conversationId?: string;

  @IsString()
  @IsOptional()
  channel?: string; // WEB, WHATSAPP, EMAIL, API, WORKFLOW

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
