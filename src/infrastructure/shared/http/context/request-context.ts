import { v4 as uuid } from 'uuid';

export class RequestContext {
  readonly requestId: string;
  readonly startTime: number;

  constructor() {
    this.requestId = uuid();
    this.startTime = Date.now();
  }

  getDuration(): number {
    return Date.now() - this.startTime;
  }
}

export function attachRequestContext(request: any): void {
  const context = new RequestContext();
  request.context = context;
}

export function getRequestContext(request: any): RequestContext {
  if (!request.context) {
    throw new Error('RequestContext not attached to request');
  }
  return request.context as RequestContext;
}
