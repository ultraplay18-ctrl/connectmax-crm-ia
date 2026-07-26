export interface IMcpServerConfig {
  id?: string;
  companyId: string;
  name: string;
  slug: string;
  type: 'STDIO' | 'SSE' | 'HTTP';
  urlOrCmd?: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
  config?: Record<string, any>;
}

export interface IMcpTool {
  name: string;
  description?: string;
  inputSchema?: Record<string, any>;
}

export interface IMcpResource {
  uri: string;
  name: string;
  mimeType?: string;
  description?: string;
}
