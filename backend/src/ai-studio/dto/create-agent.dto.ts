import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, IsObject, IsArray } from 'class-validator';

export class CreateAgentDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome do agente é obrigatório' })
  name: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  category?: string; // Vendas, Suporte, Financeiro, RH, Marketing, Cobrança, Personalizado

  @IsString()
  @IsOptional()
  responsibleId?: string;

  @IsString()
  @IsOptional()
  modelName?: string; // gpt-4o, claude-3-5-sonnet, gemini-1.5-pro, etc.

  @IsString()
  @IsOptional()
  provider?: string; // OpenAI, Anthropic, Google, DeepSeek, xAI, Ollama, OpenRouter

  @IsString()
  @IsOptional()
  status?: string; // ACTIVE, INACTIVE, ARCHIVED

  @IsString()
  @IsOptional()
  personality?: string; // FORMAL, PROFESSIONAL, FRIENDLY, CONSULTATIVE, TECHNICAL, CUSTOM

  @IsString()
  @IsOptional()
  toneOfVoice?: string;

  @IsString()
  @IsOptional()
  emoji?: string;

  @IsNumber()
  @IsOptional()
  temperature?: number;

  @IsNumber()
  @IsOptional()
  maxTokens?: number;

  @IsString()
  @IsOptional()
  initialMessage?: string;

  @IsString()
  @IsOptional()
  systemPrompt?: string;

  @IsString()
  @IsOptional()
  objective?: string;

  @IsString()
  @IsOptional()
  instructions?: string;

  @IsString()
  @IsOptional()
  language?: string;

  @IsString()
  @IsOptional()
  creativity?: string; // CREATIVE, BALANCED, PRECISE

  @IsBoolean()
  @IsOptional()
  memoryEnabled?: boolean;

  @IsOptional()
  memoryConfig?: any;

  @IsOptional()
  knowledgeBaseIds?: any;

  @IsOptional()
  toolsConfig?: any;

  @IsOptional()
  selectedTools?: any;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @IsNumber()
  @IsOptional()
  version?: number;
}
