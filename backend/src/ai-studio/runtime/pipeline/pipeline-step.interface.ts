import { RuntimeContext } from '../context/runtime-context';

export interface RuntimePipelineStep {
  name: string;
  execute(ctx: RuntimeContext): Promise<void>;
}
