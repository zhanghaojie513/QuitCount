import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RequestContextService } from './request-context.service';

type LogLevel = 'log' | 'error' | 'warn' | 'debug' | 'verbose' | 'fatal';

const secretKey = /authorization|cookie|token|password|assertion|secret/i;

function redact(value: unknown, seen = new WeakSet<object>()): unknown {
  if (value === null || typeof value !== 'object') {
    return value;
  }
  if (seen.has(value)) {
    return '[Circular]';
  }
  seen.add(value);
  if (Array.isArray(value)) {
    return value.map((item) => redact(item, seen));
  }
  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [
      key,
      secretKey.test(key) ? '[REDACTED]' : redact(item, seen),
    ]),
  );
}

@Injectable()
export class JsonLogger implements LoggerService {
  private readonly releaseSha: string;

  constructor(
    config: ConfigService,
    private readonly requestContext: RequestContextService,
  ) {
    this.releaseSha = config.get<string>('app.releaseSha', 'local');
  }

  log(message: unknown, ...optionalParams: unknown[]): void {
    this.write('log', message, optionalParams);
  }

  error(message: unknown, ...optionalParams: unknown[]): void {
    this.write('error', message, optionalParams);
  }

  warn(message: unknown, ...optionalParams: unknown[]): void {
    this.write('warn', message, optionalParams);
  }

  debug(message: unknown, ...optionalParams: unknown[]): void {
    this.write('debug', message, optionalParams);
  }

  verbose(message: unknown, ...optionalParams: unknown[]): void {
    this.write('verbose', message, optionalParams);
  }

  fatal(message: unknown, ...optionalParams: unknown[]): void {
    this.write('fatal', message, optionalParams);
  }

  private write(
    level: LogLevel,
    message: unknown,
    optionalParams: unknown[],
  ): void {
    const entry = JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      message: redact(message),
      context: redact(optionalParams),
      requestId: this.requestContext.getRequestId(),
      releaseSha: this.releaseSha,
    });

    if (level === 'error' || level === 'fatal') {
      process.stderr.write(`${entry}\n`);
      return;
    }
    process.stdout.write(`${entry}\n`);
  }
}
