export type MemoryType = 'SHORT_TERM' | 'LONG_TERM' | 'SUMMARY' | 'CONTEXT';

export interface IAgentMemoryItem {
  id?: string;
  agentId: string;
  type: MemoryType;
  key?: string;
  content: string;
  metadata?: Record<string, any>;
  createdAt?: Date;
}
