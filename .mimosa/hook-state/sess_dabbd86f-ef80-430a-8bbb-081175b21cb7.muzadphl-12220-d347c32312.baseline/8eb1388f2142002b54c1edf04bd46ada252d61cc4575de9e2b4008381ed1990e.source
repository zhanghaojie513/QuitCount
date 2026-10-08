import { ConfigService } from '@nestjs/config';
import { JsonLogger } from './json-logger.service';
import { RequestContextService } from './request-context.service';

describe('JsonLogger', () => {
  let stdout: jest.SpyInstance;
  let stderr: jest.SpyInstance;
  let logger: JsonLogger;

  beforeEach(() => {
    stdout = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
    stderr = jest.spyOn(process.stderr, 'write').mockImplementation(() => true);
    const config = {
      get: jest.fn().mockReturnValue('test-sha'),
    } as unknown as ConfigService;
    const requestContext = {
      getRequestId: jest.fn().mockReturnValue('request-1'),
    } as unknown as RequestContextService;
    logger = new JsonLogger(config, requestContext);
  });

  afterEach(() => {
    stdout.mockRestore();
    stderr.mockRestore();
  });

  it('writes structured logs and redacts secrets', () => {
    logger.log('event', { accessToken: 'secret', nested: { value: 1 } });
    logger.warn('warning');
    logger.debug('debug');
    logger.verbose('verbose');

    const entry = String(stdout.mock.calls[0][0]);
    expect(entry).toContain('"requestId":"request-1"');
    expect(entry).toContain('"accessToken":"[REDACTED]"');
    expect(entry).not.toContain('"accessToken":"secret"');
  });

  it('writes errors and fatal messages to stderr', () => {
    const circular: Record<string, unknown> = {};
    circular.self = circular;

    logger.error('error', circular);
    logger.fatal('fatal');

    expect(stderr).toHaveBeenCalledTimes(2);
    expect(String(stderr.mock.calls[0][0])).toContain('[Circular]');
  });
});
