import { validateEnvironment } from './environment';

describe('validateEnvironment', () => {
  it('normalizes a valid test environment', () => {
    const result = validateEnvironment({
      NODE_ENV: 'test',
      API_PREFIX: '/api/v1/',
      PORT: '3100',
      DATABASE_POOL_MAX: '5',
      DATABASE_CONNECT_TIMEOUT_MS: '500',
    });

    expect(result).toMatchObject({
      NODE_ENV: 'test',
      API_PREFIX: 'api/v1',
      PORT: '3100',
      DATABASE_POOL_MAX: '5',
      DATABASE_CONNECT_TIMEOUT_MS: '500',
      LOG_LEVEL: 'info',
      RELEASE_SHA: 'local',
      CORS_ORIGINS: '',
    });
    expect(result.DATABASE_URL).toContain('quitcount_test');
  });

  it.each([
    [{ NODE_ENV: 'invalid' }, 'NODE_ENV'],
    [{ NODE_ENV: 'production' }, 'DATABASE_URL'],
    [{ NODE_ENV: 'test', DATABASE_URL: 'not-a-url' }, 'valid PostgreSQL URL'],
    [
      { NODE_ENV: 'test', DATABASE_URL: 'https://example.com/db' },
      'postgres or postgresql',
    ],
    [{ NODE_ENV: 'test', API_PREFIX: '///' }, 'API_PREFIX'],
    [{ NODE_ENV: 'test', PORT: '0' }, 'PORT'],
    [{ NODE_ENV: 'test', DATABASE_POOL_MAX: '101' }, 'DATABASE_POOL_MAX'],
    [
      { NODE_ENV: 'test', DATABASE_CONNECT_TIMEOUT_MS: '99' },
      'DATABASE_CONNECT_TIMEOUT_MS',
    ],
  ])('rejects invalid configuration %#', (input, expectedMessage) => {
    expect(() => validateEnvironment(input)).toThrow(expectedMessage);
  });
});
