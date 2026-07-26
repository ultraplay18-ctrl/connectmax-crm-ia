import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Nome do usuário é obrigatório.' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Email do usuário é obrigatório.' })
  @IsEmail({}, { message: 'Email inválido.' })
  email: string;

  @IsNotEmpty({ message: 'Senha é obrigatória.' })
  @MinLength(6, { message: 'A senha deve conter pelo menos 6 caracteres.' })
  password: string;

  @IsOptional()
  @IsString()
  roleId?: string;

  @IsOptional()
  @IsString()
  roleName?: string; // COMPANY_ADMIN, EMPLOYEE, SUPER_ADMIN
}
