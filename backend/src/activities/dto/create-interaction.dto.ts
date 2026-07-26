import { IsNotEmpty, IsOptional, IsString, IsEnum } from 'class-validator';

export enum InteractionType {
  CALL = 'CALL',
  MESSAGE = 'MESSAGE',
  NOTE = 'NOTE',
  MEETING = 'MEETING',
  STAGE_CHANGE = 'STAGE_CHANGE',
}

export class CreateInteractionDto {
  @IsNotEmpty({ message: 'Título da interação é obrigatório.' })
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(InteractionType)
  type?: InteractionType;

  @IsOptional()
  @IsString()
  contactId?: string;

  @IsOptional()
  @IsString()
  leadId?: string;
}
