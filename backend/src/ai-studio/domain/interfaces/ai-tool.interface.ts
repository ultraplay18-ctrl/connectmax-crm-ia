export interface ToolParameterSchema {
  type: string;
  description: string;
  required?: boolean;
}

export interface IAiTool {
  name: string;
  slug: string;
  description: string;
  category: string;
  parametersSchema: Record<string, ToolParameterSchema>;
  execute(params: Record<string, any>, context?: any): Promise<any>;
}
