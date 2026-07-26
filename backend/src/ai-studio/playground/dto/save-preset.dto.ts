import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class SavePresetDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome do preset é obrigatório' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty({ message: 'O system prompt é obrigatório' })
  systemPrompt: string;

  @IsString()
  @IsOptional()
  provider?: string;

  @IsString()
  @IsOptional()
  modelName?: string;

  @IsNumber()
  @IsOptional()
  temperature?: number;

  @IsString()
  @IsOptional()
  tools?: string;
}
