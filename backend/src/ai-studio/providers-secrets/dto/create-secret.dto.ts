import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSecretDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome da chave é obrigatório' })
  keyName: string; // OPENAI_API_KEY, CLAUDE_API_KEY, GEMINI_API_KEY, DEEPSEEK_API_KEY, OPENROUTER_API_KEY, GROK_API_KEY, OLLAMA_SERVER, MCP_TOKENS, WEBHOOK_TOKENS, API_TOKENS

  @IsString()
  @IsNotEmpty({ message: 'O valor da chave é obrigatório' })
  value: string;

  @IsString()
  @IsOptional()
  category?: string; // PROVIDER, MCP, WEBHOOK, API
}
