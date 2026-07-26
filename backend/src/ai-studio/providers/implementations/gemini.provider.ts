import { Injectable } from '@nestjs/common';
import { BaseAiProvider } from '../base-ai.provider';

@Injectable()
export class GeminiProvider extends BaseAiProvider {
  getProviderName(): string {
    return 'Google';
  }

  getSupportedModels(): string[] {
    return ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-2.0-flash'];
  }
}
