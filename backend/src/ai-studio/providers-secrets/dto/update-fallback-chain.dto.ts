import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class UpdateFallbackChainDto {
  @IsArray()
  @IsNotEmpty({ message: 'A cadeia de provedores é obrigatória' })
  providers: string[]; // Ex: ["OpenAI", "Claude", "Gemini", "DeepSeek", "OpenRouter", "Ollama"]
}
