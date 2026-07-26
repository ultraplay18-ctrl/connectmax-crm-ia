import { Observable } from 'rxjs';

export interface StreamChunk {
  delta: string;
  isComplete: boolean;
  tokensUsed?: number;
}

export interface StreamAdapterInterface {
  streamResponse(prompt: string, options?: any): Observable<StreamChunk>;
}
