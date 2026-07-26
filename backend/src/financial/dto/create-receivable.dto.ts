import { IsNotEmpty, IsOptional, IsString, IsNumber, IsDateString, IsEnum } from 'class-validator';

export enum FinancialStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
}

export class CreateReceivableDto {
  @IsNotEmpty({ message: 'Descrição do lançamento é obrigatória.' })
  @IsString()
  description: string;

  @IsNotEmpty({ message: 'Valor é obrigatório.' })
  @IsNumber({}, { message: 'Valor deve ser um número válido.' })
  amount: number;

  @IsNotEmpty({ message: 'Data de vencimento é obrigatória.' })
  @IsDateString({}, { message: 'Data de vencimento inválida.' })
  dueDate: string;

  @IsOptional()
  @IsString()
  contactId?: string;

  @IsOptional()
  @IsString()
  leadId?: string;

  @IsOptional()
  @IsEnum(FinancialStatus)
  status?: FinancialStatus;

  @IsOptional()
  @IsDateString()
  paymentDate?: string;
}
