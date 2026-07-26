import { IsOptional, IsString, IsNumber, IsDateString, IsEnum } from 'class-validator';
import { FinancialStatus } from './create-receivable.dto';

export class UpdatePayableDto {
  @IsOptional()
  @IsString()
  supplier?: string;

  @IsOptional()
  @IsString()
  category?: string;

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
}
