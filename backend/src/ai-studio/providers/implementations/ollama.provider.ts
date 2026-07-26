import { Injectable } from '@nestjs/common';
import { BaseAiProvider } from '../base-ai.provider';

@Injectable()
export class OllamaProvider extends BaseAiProvider {
  getProviderName(): string {
    return 'Ollama';
  }

  getSupportedModels(): string[] {
    return ['llama3.2', 'mistral-7b', 'phi-3', 'qwen2.5-coder'];
  }
}
