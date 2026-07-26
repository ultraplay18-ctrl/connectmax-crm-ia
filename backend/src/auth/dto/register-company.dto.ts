import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterCompanyDto {
  // Dados da Empresa
  @IsNotEmpty({ message: 'Nome da empresa é obrigatório.' })
  @IsString()
  companyName: string;

  @IsNotEmpty({ message: 'CNPJ é obrigatório.' })
  @IsString()
  document: string;

  @IsNotEmpty({ message: 'Email da empresa é obrigatório.' })
  @IsEmail({}, { message: 'Email da empresa inválido.' })
  companyEmail: string;

  @IsOptional()
  @IsString()
  phone?: string;

  // Dados do Primeiro Administrador (COMPANY_ADMIN)
  @IsNotEmpty({ message: 'Nome do administrador é obrigatório.' })
  @IsString()
  adminName: string;

  @IsNotEmpty({ message: 'Email do administrador é obrigatório.' })
  @IsEmail({}, { message: 'Email do administrador inválido.' })
  adminEmail: string;

  @IsNotEmpty({ message: 'Senha é obrigatória.' })
  @MinLength(6, { message: 'A senha deve conter no mínimo 6 caracteres.' })
  adminPassword: string;

  @IsOptional()
  @IsString()
  planName?: string;
}
