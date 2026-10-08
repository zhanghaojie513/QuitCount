import {
  ArgumentsHost,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { ApiExceptionFilter } from './api-exception.filter';
import { JsonLogger } from './json-logger.service';
import { RequestContextService } from './request-context.service';

describe('ApiExceptionFilter', () => {
  const json = jest.fn();
  const status = jest.fn().mockReturnValue({ json });
  const response = { status } as unknown as Response;
  const host = {
    switchToHttp: () => ({
      getResponse: () => response,
    }),
  } as unknown as ArgumentsHost;
  const requestContext = {
    getRequestId: jest.fn().mockReturnValue('request-1'),
  } as unknown as RequestContextService;
  const logger = {
    error: jest.fn(),
  } as unknown as JsonLogger;
  const filter = new ApiExceptionFilter(requestContext, logger);

  beforeEach(() => {
    jest.clearAllMocks();
    status.mockReturnValue({ json });
  });

  it('keeps a structured application error', () => {
    filter.catch(
      new BadRequestException({
        code: 'VALIDATION_FAILED',
        message: ['invalid field'],
        details: [{ property: 'field' }],
      }),
      host,
    );

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({
          code: 'VALIDATION_FAILED',
          message: 'invalid field',
          requestId: 'request-1',
        }),
      }),
    );
  });

  it('maps string HTTP responses', () => {
    filter.catch(new HttpException('missing', HttpStatus.NOT_FOUND), host);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({
          code: 'NOT_FOUND',
          message: 'missing',
        }),
      }),
    );
  });

  it('hides unexpected internal error details', () => {
    filter.catch(new Error('database password leaked'), host);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({
          code: 'INTERNAL_ERROR',
          message: '服务暂时不可用',
        }),
      }),
    );
    expect(logger.error).toHaveBeenCalled();
  });
});
