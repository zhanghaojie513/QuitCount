import { randomUUID } from 'node:crypto';
import { Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { RequestContextService } from './request-context.service';

const validRequestId = /^[A-Za-z0-9._:-]{1,64}$/;

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  constructor(private readonly requestContext: RequestContextService) {}

  use(request: Request, response: Response, next: NextFunction): void {
    const supplied = request.header('x-request-id');
    const requestId =
      supplied && validRequestId.test(supplied) ? supplied : randomUUID();

    response.setHeader('x-request-id', requestId);
    this.requestContext.run(requestId, next);
  }
}
