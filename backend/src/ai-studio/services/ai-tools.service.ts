import { Injectable } from '@nestjs/common';
import { ToolRegistry } from '../tools/tool.registry';

@Injectable()
export class AiToolsService {
  constructor(private readonly toolRegistry: ToolRegistry) {}

  async findAll() {
    return this.toolRegistry.getAllTools().map((t) => ({
      name: t.name,
      slug: t.slug,
      description: t.description,
      category: t.category,
      parametersSchema: t.parametersSchema,
      enabled: true,
    }));
  }
}
