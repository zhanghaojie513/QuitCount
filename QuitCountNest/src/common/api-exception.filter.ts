import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { JsonLogger } from './json-logger.service';
import { RequestContextService } from './request-context.service';

interface ApiErrorPayload {
  code?: string;
  message?: string | string[];
  details?: unknown;
}

const statusCodes: Record<number, string> = {
  [HttpStatus.BAD_REQUEST]: 'BAD_REQUEST',
  [HttpStatus.UNAUTHORIZED]: 'UNAUTHORIZED',
  [HttpStatus.FORBIDDEN]: 'FORBIDDEN',
  [HttpStatus.NOT_FOUND]: 'NOT_FOUND',
  [HttpStatus.CONFLICT]: 'CONFLICT',
  [HttpStatus.UNPROCESSABLE_ENTITY]: 'UNPROCESSABLE_ENTITY',
  [HttpStatus.TOO_MANY_REQUESTS]: 'RATE_LIMITED',
};

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly requestContext: RequestContextService,
    private readonly logger: JsonLogger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const requestId = this.requestContext.getRequestId();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const payload =
      exception instanceof HttpException
        ? this.normalize(exception.getResponse())
        : {};
    const code =
      payload.code ??
      statusCodes[status] ??
      (status >= 500 ? 'INTERNAL_ERROR' : 'REQUEST_FAILED');
    const message =
      status >= 500
        ? '服务暂时不可用'
        : (this.normalizeMessage(payload.message) ?? '请求失败');

    if (status >= 500) {
      this.logger.error('unhandled_http_exception', {
        requestId,
        exception:
          exception instanceof Error
            ? { name: exception.name, message: exception.message }
            : String(exception),
      });
    }

    response.status(status).json({
      error: {
        code,
        message,
        details: payload.details,
        requestId,
      },
      serverTime: new Date().toISOString(),
    });
  }

  private normalize(response: string | object): ApiErrorPayload {
    if (typeof response === 'string') {
      return { message: response };
    }
    return response as ApiErrorPayload;
  }

  private normalizeMessage(
    message: string | string[] | undefined,
  ): string | undefined {
    if (Array.isArray(message)) {
      return message.join('; ');
    }
    return message;
  }
}
