import configuration from './configuration';

describe('configuration', () => {
  const original = { ...process.env };

  afterEach(() => {
    process.env = { ...original };
  });

  it('maps environment values into namespaced configuration', () => {
    process.env.NODE_ENV = 'production';
    process.env.PORT = '4000';
    process.env.API_PREFIX = 'service/v1';
    process.env.RELEASE_SHA = 'abc123';
    process.env.LOG_LEVEL = 'warn';
    process.env.CORS_ORIGINS = 'https://a.example, https://b.example';
    process.env.DATABASE_URL = 'postgresql://example';
    process.env.DATABASE_POOL_MAX = '20';
    process.env.DATABASE_CONNECT_TIMEOUT_MS = '1500';

    expect(configuration()).toEqual({
      app: {
        environment: 'production',
        port: 4000,
        apiPrefix: 'service/v1',
        releaseSha: 'abc123',
        logLevel: 'warn',
        corsOrigins: ['https://a.example', 'https://b.example'],
      },
      database: {
        url: 'postgresql://example',
        poolMax: 20,
        connectTimeoutMs: 1500,
      },
    });
  });

  it('provides safe non-secret defaults', () => {
    delete process.env.NODE_ENV;
    delete process.env.PORT;
    delete process.env.API_PREFIX;
    delete process.env.RELEASE_SHA;
    delete process.env.LOG_LEVEL;
    delete process.env.CORS_ORIGINS;
    delete process.env.DATABASE_POOL_MAX;
    delete process.env.DATABASE_CONNECT_TIMEOUT_MS;

    const result = configuration();
    expect(result.app).toMatchObject({
      environment: 'development',
      port: 3000,
      apiPrefix: 'api/v1',
      releaseSha: 'local',
      logLevel: 'info',
      corsOrigins: [],
    });
    expect(result.database).toMatchObject({
      poolMax: 10,
      connectTimeoutMs: 3000,
    });
  });
});
