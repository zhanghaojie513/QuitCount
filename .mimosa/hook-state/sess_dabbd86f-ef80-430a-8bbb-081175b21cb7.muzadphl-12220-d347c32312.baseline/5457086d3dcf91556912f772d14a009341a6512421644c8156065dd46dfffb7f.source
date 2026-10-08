import { CallHandler, ExecutionContext } from '@nestjs/common';
import type { Request, Response } from 'express';
import { lastValueFrom, of } from 'rxjs';
import { JsonLogger } from './json-logger.service';
import { RequestContextService } from './request-context.service';
import { RequestLoggingInterceptor } from './request-logging.interceptor';

describe('RequestLoggingInterceptor', () => {
  it('logs method, path, status and request id after completion', async () => {
    const request = {
      method: 'GET',
      originalUrl: '/api/v1/health/live',
    } as Request;
    const response = { statusCode: 200 } as Response;
    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
        getResponse: () => response,
      }),
    } as unknown as ExecutionContext;
    const handler = {
      handle: () => of({ ok: true }),
    } as CallHandler;
    const logger = { log: jest.fn() } as unknown as JsonLogger;
    const requestContext = {
      getRequestId: jest.fn().mockReturnValue('request-1'),
    } as unknown as RequestContextService;
    const interceptor = new RequestLoggingInterceptor(logger, requestContext);

    await lastValueFrom(interceptor.intercept(context, handler));

    expect(logger.log).toHaveBeenCalledWith(
      'http_request_completed',
      expect.objectContaining({
        requestId: 'request-1',
        method: 'GET',
        path: '/api/v1/health/live',
        statusCode: 200,
      }),
    );
  });
});
