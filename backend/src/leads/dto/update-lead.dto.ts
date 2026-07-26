import { IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';
import { LeadStatus } from './create-lead.dto';

export class UpdateLeadDto {
  @IsOptional()
  @IsString()
  title?: string;

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
