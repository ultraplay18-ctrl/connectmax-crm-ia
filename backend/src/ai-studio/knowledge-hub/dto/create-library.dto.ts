import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateLibraryDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome da biblioteca é obrigatório' })
  name: string;

  @IsString()
  @IsOptional()
  category?: string; // Produtos, Financeiro, RH, Jurídico, Marketing, Comercial, Personalizado

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsString()
  @IsOptional()
  accessLevel?: string; // ADMIN, EDITOR, READER
}
