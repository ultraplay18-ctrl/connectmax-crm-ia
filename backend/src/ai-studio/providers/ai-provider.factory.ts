import { Injectable, NotFoundException } from '@nestjs/common';
import { IAiProvider } from '../domain/interfaces/ai-provider.interface';
import { OpenAIProvider } from './implementations/openai.provider';
import { ClaudeProvider } from './implementations/claude.provider';
import { GeminiProvider } from './implementations/gemini.provider';
import { DeepSeekProvider } from './implementations/deepseek.provider';
import { GrokProvider } from './implementations/grok.provider';
import { OllamaProvider } from './implementations/ollama.provider';
import { OpenRouterProvider } from './implementations/openrouter.provider';

@Injectable()
export class AiProviderFactory {
  private providers: Map<string, IAiProvider> = new Map();

  constructor(
    openAi: OpenAIProvider,
    claude: ClaudeProvider,
    gemini: GeminiProvider,
    deepSeek: DeepSeekProvider,
    grok: GrokProvider,
    ollama: OllamaProvider,
    openRouter: OpenRouterProvider,
  ) {
    this.providers.set('openai', openAi);
    this.providers.set('anthropic', claude);
    this.providers.set('google', gemini);
    this.providers.set('deepseek', deepSeek);
    this.providers.set('xai', grok);
    this.providers.set('ollama', ollama);
    this.providers.set('openrouter', openRouter);
  }

  getProvider(providerName: string): IAiProvider {
    const normalized = (providerName || 'openai').toLowerCase();
    const provider = this.providers.get(normalized);

    if (!provider) {
      // Fallback padrão para OpenAI se não encontrar o nome exato
      return this.providers.get('openai')!;
    }

    return provider;
  }

  getAllProviders(): string[] {
    return Array.from(this.providers.keys());
  }
}
