import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class CreateMcpServerDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome do servidor MCP é obrigatório' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'O slug do servidor MCP é obrigatório' })
  slug: string;

  @IsString()
  @IsOptional()
  type?: 'STDIO' | 'SSE' | 'HTTP';

  @IsString()
  @IsOptional()
  urlOrCmd?: string;

  @IsObject()
  @IsOptional()
  config?: Record<string, any>;
}
