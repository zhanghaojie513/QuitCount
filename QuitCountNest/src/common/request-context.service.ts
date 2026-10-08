import { AsyncLocalStorage } from 'node:async_hooks';
import { Injectable } from '@nestjs/common';

interface RequestContextState {
  requestId: string;
}

@Injectable()
export class RequestContextService {
  private readonly storage = new AsyncLocalStorage<RequestContextState>();

  run(requestId: string, next: () => void): void {
    this.storage.run({ requestId }, next);
  }

  getRequestId(): string | undefined {
    return this.storage.getStore()?.requestId;
  }
}
