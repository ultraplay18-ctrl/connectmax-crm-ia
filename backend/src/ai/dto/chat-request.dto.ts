import { IsNotEmpty, IsString } from 'class-validator';

export class ChatRequestDto {
  @IsNotEmpty({ message: 'A mensagem para a IA é obrigatória.' })
  @IsString()
  message: string;
}
