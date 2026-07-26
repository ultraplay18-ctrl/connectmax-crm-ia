import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class UpdateAgentDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  responsibleId?: string;

  @IsString()
  @IsOptional()
  modelName?: string;

  @IsString()
  @IsOptional()
  provider?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  personality?: string;

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
  creativity?: string;

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
