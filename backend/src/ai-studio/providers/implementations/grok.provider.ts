import { Injectable } from '@nestjs/common';
import { BaseAiProvider } from '../base-ai.provider';

@Injectable()
export class GrokProvider extends BaseAiProvider {
  getProviderName(): string {
    return 'xAI';
  }

  getSupportedModels(): string[] {
    return ['grok-2', 'grok-2-mini', 'grok-vision-beta'];
  }
}
