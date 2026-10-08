export type NodeEnvironment = 'development' | 'test' | 'production';

export interface Environment {
  NODE_ENV: NodeEnvironment;
  PORT: string;
  API_PREFIX: string;
  DATABASE_URL: string;
  DATABASE_POOL_MAX: string;
  DATABASE_CONNECT_TIMEOUT_MS: string;
  LOG_LEVEL: string;
  RELEASE_SHA: string;
  CORS_ORIGINS: string;
  [key: string]: unknown;
}

const nodeEnvironments = new Set<NodeEnvironment>([
  'development',
  'test',
  'production',
]);

function parseInteger(
  value: unknown,
  name: string,
  minimum: number,
  maximum: number,
  fallback: number,
): string {
  const normalized = value === undefined ? String(fallback) : String(value);
  const parsed = Number(normalized);
  if (!Number.isInteger(parsed) || parsed < minimum || parsed > maximum) {
    throw new Error(
      `${name} must be an integer between ${minimum} and ${maximum}`,
    );
  }
  return String(parsed);
}

export function validateEnvironment(raw: Record<string, unknown>): Environment {
  const nodeEnvironment = String(raw.NODE_ENV ?? 'development');
  if (!nodeEnvironments.has(nodeEnvironment as NodeEnvironment)) {
    throw new Error('NODE_ENV must be development, test, or production');
  }

  const databaseUrl =
    raw.DATABASE_URL ??
    (nodeEnvironment === 'test'
      ? 'postgresql://test:test@127.0.0.1:5432/quitcount_test?schema=public'
      : undefined);
  if (typeof databaseUrl !== 'string' || databaseUrl.length === 0) {
    throw new Error('DATABASE_URL is required');
  }

  let parsedDatabaseUrl: URL;
  try {
    parsedDatabaseUrl = new URL(databaseUrl);
  } catch {
    throw new Error('DATABASE_URL must be a valid PostgreSQL URL');
  }
  if (!['postgres:', 'postgresql:'].includes(parsedDatabaseUrl.protocol)) {
    throw new Error(
      'DATABASE_URL must use the postgres or postgresql protocol',
    );
  }

  const apiPrefix = String(raw.API_PREFIX ?? 'api/v1')
    .replace(/^\/+/, '')
    .replace(/\/+$/, '');
  if (apiPrefix.length === 0) {
    throw new Error('API_PREFIX must not be empty');
  }

  return {
    ...raw,
    NODE_ENV: nodeEnvironment as NodeEnvironment,
    PORT: parseInteger(raw.PORT, 'PORT', 1, 65535, 3000),
    API_PREFIX: apiPrefix,
    DATABASE_URL: databaseUrl,
    DATABASE_POOL_MAX: parseInteger(
      raw.DATABASE_POOL_MAX,
      'DATABASE_POOL_MAX',
      1,
      100,
      10,
    ),
    DATABASE_CONNECT_TIMEOUT_MS: parseInteger(
      raw.DATABASE_CONNECT_TIMEOUT_MS,
      'DATABASE_CONNECT_TIMEOUT_MS',
      100,
      60000,
      3000,
    ),
    LOG_LEVEL: String(raw.LOG_LEVEL ?? 'info'),
    RELEASE_SHA: String(raw.RELEASE_SHA ?? 'local'),
    CORS_ORIGINS: String(raw.CORS_ORIGINS ?? ''),
  };
}
