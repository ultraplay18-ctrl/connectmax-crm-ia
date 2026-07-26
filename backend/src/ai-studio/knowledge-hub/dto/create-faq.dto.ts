import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateFaqDto {
  @IsString()
  @IsNotEmpty({ message: 'O ID da biblioteca é obrigatório' })
  libraryId: string;

  @IsString()
  @IsNotEmpty({ message: 'A pergunta é obrigatória' })
  question: string;

  @IsString()
  @IsNotEmpty({ message: 'A resposta é obrigatória' })
  answer: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  tags?: string;
}
