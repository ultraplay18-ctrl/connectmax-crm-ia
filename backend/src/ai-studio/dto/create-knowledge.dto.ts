import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateKnowledgeBaseDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome da base de conhecimento é obrigatório' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  agentId?: string;
}
