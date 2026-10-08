import { Global, Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ApiExceptionFilter } from './api-exception.filter';
import { JsonLogger } from './json-logger.service';
import { RequestContextService } from './request-context.service';
import { RequestIdMiddleware } from './request-id.middleware';
import { RequestLoggingInterceptor } from './request-logging.interceptor';

@Global()
@Module({
  providers: [
    RequestContextService,
    RequestIdMiddleware,
    JsonLogger,
    {
      provide: APP_FILTER,
      useClass: ApiExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestLoggingInterceptor,
    },
  ],
  exports: [RequestContextService, RequestIdMiddleware, JsonLogger],
})
export class CommonModule {}
