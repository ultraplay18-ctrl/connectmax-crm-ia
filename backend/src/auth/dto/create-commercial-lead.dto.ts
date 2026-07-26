import { IsEmail, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateCommercialLeadDto {
  @IsNotEmpty({ message: 'Nome é obrigatório.' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Nome da empresa é obrigatório.' })
  @IsString()
  companyName: string;

  @IsNotEmpty({ message: 'Email é obrigatório.' })
  @IsEmail({}, { message: 'Email inválido.' })
  email: string;

  @IsNotEmpty({ message: 'Telefone é obrigatório.' })
  @IsString()
  phone: string;

  @IsNotEmpty({ message: 'Quantidade de usuários é obrigatória.' })
  @IsNumber()
  @Min(1, { message: 'Quantidade de usuários deve ser pelo menos 1.' })
  usersCount: number;
}
