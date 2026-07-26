import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class ExecutePlaygroundDto {
  @IsString()
  @IsOptional()
  agentId?: string;

  @IsString()
  @IsNotEmpty({ message: 'A mensagem de entrada é obrigatória' })
  input: string;

  @IsString()
  @IsOptional()
  provider?: string; // OpenAI, Claude, Gemini, DeepSeek, Grok, Ollama, OpenRouter

  @IsString()
  @IsOptional()
  modelName?: string;

  @IsNumber()
  @IsOptional()
  temperature?: number;

  @IsNumber()
  @IsOptional()
  maxTokens?: number;

  @IsString()
  @IsOptional()
  systemPrompt?: string;

  @IsString()
  @IsOptional()
  tools?: string; // JSON array or comma list

  @IsString()
  @IsOptional()
  memoryTypes?: string;

  @IsString()
  @IsOptional()
  knowledgeLibs?: string;
}
