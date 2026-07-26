import { IsNotEmpty, IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';

export enum LeadStatus {
  NEW_LEAD = 'NEW_LEAD',
  FIRST_CONTACT = 'FIRST_CONTACT',
  QUALIFICATION = 'QUALIFICATION',
  PROPOSAL_SENT = 'PROPOSAL_SENT',
  NEGOTIATION = 'NEGOTIATION',
  WON = 'WON',
  LOST = 'LOST',
}

export class CreateLeadDto {
  @IsNotEmpty({ message: 'Título da oportunidade é obrigatório.' })
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  contactId?: string;

  @IsOptional()
  @IsString()
  assignedUserId?: string;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsEnum(LeadStatus)
  status?: LeadStatus;

  @IsOptional()
  @IsNumber({}, { message: 'Valor deve ser um número válido.' })
  value?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
