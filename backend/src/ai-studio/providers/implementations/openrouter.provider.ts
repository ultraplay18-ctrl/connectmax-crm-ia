import { Injectable } from '@nestjs/common';
import { BaseAiProvider } from '../base-ai.provider';

@Injectable()
export class OpenRouterProvider extends BaseAiProvider {
  getProviderName(): string {
    return 'OpenRouter';
  }

  getSupportedModels(): string[] {
    return ['openrouter/auto', 'anthropic/claude-3.5-sonnet', 'meta-llama/llama-3.3-70b-instruct'];
  }
}
