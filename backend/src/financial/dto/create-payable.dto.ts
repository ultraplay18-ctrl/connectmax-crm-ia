import { IsNotEmpty, IsOptional, IsString, IsNumber, IsDateString, IsEnum } from 'class-validator';
import { FinancialStatus } from './create-receivable.dto';

export class CreatePayableDto {
  @IsNotEmpty({ message: 'Nome do fornecedor é obrigatório.' })
  @IsString()
  supplier: string;

  @IsNotEmpty({ message: 'Categoria da despesa é obrigatória.' })
  @IsString()
  category: string;

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
  @IsEnum(FinancialStatus)
  status?: FinancialStatus;

  @IsOptional()
  @IsDateString()
  paymentDate?: string;
}
