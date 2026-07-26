import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SimulateIncomingDto {
  @IsNotEmpty({ message: 'Número de telefone do WhatsApp é obrigatório.' })
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  clientName?: string;

  @IsNotEmpty({ message: 'Conteúdo da mensagem é obrigatório.' })
  @IsString()
  content: string;
}
