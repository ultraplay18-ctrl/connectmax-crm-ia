import { Injectable } from '@nestjs/common';
import { BaseAiProvider } from '../base-ai.provider';

@Injectable()
export class DeepSeekProvider extends BaseAiProvider {
  getProviderName(): string {
    return 'DeepSeek';
  }

  getSupportedModels(): string[] {
    return ['deepseek-chat-v3', 'deepseek-coder', 'deepseek-r1'];
  }
}
