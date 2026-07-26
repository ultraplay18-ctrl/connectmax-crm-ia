import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty({ message: 'Nome da empresa é obrigatório.' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'CNPJ é obrigatório.' })
  @IsString()
  document: string;

  @IsNotEmpty({ message: 'Email da empresa é obrigatório.' })
  @IsEmail({}, { message: 'Email inválido.' })
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
