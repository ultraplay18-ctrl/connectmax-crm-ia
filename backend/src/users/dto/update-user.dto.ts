import { IsEmail, IsOptional, IsString, IsEnum, MinLength } from 'class-validator';

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email inválido.' })
  email?: string;

  @IsOptional()
  @MinLength(6, { message: 'A senha deve conter pelo menos 6 caracteres.' })
  password?: string;

  @IsOptional()
  @IsString()
  roleId?: string;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
