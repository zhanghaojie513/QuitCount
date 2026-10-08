import type { NextFunction, Request, Response } from 'express';
import { RequestContextService } from './request-context.service';
import { RequestIdMiddleware } from './request-id.middleware';

describe('RequestIdMiddleware', () => {
  const response = {
    setHeader: jest.fn(),
  } as unknown as Response;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('preserves a valid caller request id', () => {
    const context = new RequestContextService();
    const middleware = new RequestIdMiddleware(context);
    const request = {
      header: jest.fn().mockReturnValue('client-request:1'),
    } as unknown as Request;
    const next = jest.fn() as NextFunction;

    middleware.use(request, response, next);

    expect(response.setHeader).toHaveBeenCalledWith(
      'x-request-id',
      'client-request:1',
    );
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('replaces an invalid caller request id', () => {
    const context = new RequestContextService();
    const middleware = new RequestIdMiddleware(context);
    const request = {
      header: jest.fn().mockReturnValue('contains spaces'),
    } as unknown as Request;

    middleware.use(request, response, jest.fn());

    const generated = (response.setHeader as jest.Mock).mock.calls[0][1];
    expect(generated).toMatch(/^[0-9a-f-]{36}$/);
  });
});
