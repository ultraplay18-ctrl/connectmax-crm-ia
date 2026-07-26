import { Injectable } from '@nestjs/common';
import { BaseAiProvider } from '../base-ai.provider';

@Injectable()
export class ClaudeProvider extends BaseAiProvider {
  getProviderName(): string {
    return 'Anthropic';
  }

  getSupportedModels(): string[] {
    return ['claude-3-5-sonnet', 'claude-3-5-haiku', 'claude-3-opus'];
  }
}
