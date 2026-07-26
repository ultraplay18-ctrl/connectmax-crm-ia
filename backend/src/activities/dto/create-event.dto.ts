import { IsNotEmpty, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty({ message: 'Título do compromisso é obrigatório.' })
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty({ message: 'Data de início é obrigatória.' })
  @IsDateString({}, { message: 'Data de início inválida.' })
  startDate: string;

  @IsNotEmpty({ message: 'Data de término é obrigatória.' })
  @IsDateString({}, { message: 'Data de término inválida.' })
  endDate: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  contactId?: string;

  @IsOptional()
  @IsString()
  leadId?: string;

  @IsOptional()
  @IsString()
  assignedUserId?: string;
}
