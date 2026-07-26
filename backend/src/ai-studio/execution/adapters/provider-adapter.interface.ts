import { ExecutionContext } from '../interfaces/execution-context.interface';

export interface ProviderAdapterInterface {
  readonly providerName: string;
  supports(providerName: string): boolean;
  generateResponse(ctx: ExecutionContext): Promise<string>;
}
