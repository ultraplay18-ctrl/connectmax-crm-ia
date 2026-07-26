import { IsOptional, IsString, IsNumber, IsDateString, IsEnum } from 'class-validator';
import { FinancialStatus } from './create-receivable.dto';

export class UpdateReceivableDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsDateString()
  paymentDate?: string;

  @IsOptional()
  @IsEnum(FinancialStatus)
  status?: FinancialStatus;

  @IsOptional()
  @IsString()
  contactId?: string;

  @IsOptional()
  @IsString()
  leadId?: string;
}
