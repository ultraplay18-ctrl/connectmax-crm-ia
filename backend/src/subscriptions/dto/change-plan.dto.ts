import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePlanDto {
  @IsNotEmpty({ message: 'O ID do plano desejado é obrigatório.' })
  @IsString()
  planId: string;
}
