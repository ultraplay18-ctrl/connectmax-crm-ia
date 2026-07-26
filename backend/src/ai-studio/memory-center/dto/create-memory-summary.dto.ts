import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMemorySummaryDto {
  @IsString()
  @IsOptional()
  profileId?: string;

  @IsString()
  @IsNotEmpty({ message: 'O tipo de período é obrigatório' })
  periodType: string; // DAILY, WEEKLY, MONTHLY, CONVERSATION, CUSTOMER

  @IsString()
  @IsNotEmpty({ message: 'O conteúdo do resumo é obrigatório' })
  content: string;
}
