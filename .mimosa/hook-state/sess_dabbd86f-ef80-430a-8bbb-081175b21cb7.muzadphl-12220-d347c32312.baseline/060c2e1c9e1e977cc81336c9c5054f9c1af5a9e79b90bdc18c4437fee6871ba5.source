import { ConfigService } from '@nestjs/config';
import { HealthCheckService, HealthIndicatorService } from '@nestjs/terminus';
import { PrismaService } from '../../database/prisma.service';
import { ApplicationHealthIndicator } from './application-health.indicator';
import { DatabaseHealthIndicator } from './database-health.indicator';
import { HealthController } from './health.controller';

describe('health checks', () => {
  const up = jest.fn().mockImplementation((details?: object) => ({
    application: { status: 'up', ...details },
  }));
  const down = jest.fn().mockReturnValue({
    database: { status: 'down' },
  });
  const healthIndicator = {
    check: jest.fn().mockReturnValue({ up, down }),
  } as unknown as HealthIndicatorService;

  beforeEach(() => {
    jest.clearAllMocks();
    (healthIndicator.check as jest.Mock).mockReturnValue({ up, down });
  });

  it('reports application release metadata', () => {
    const config = {
      get: jest.fn().mockReturnValue('test-sha'),
    } as unknown as ConfigService;
    const indicator = new ApplicationHealthIndicator(healthIndicator, config);

    expect(indicator.check()).toEqual({
      application: { status: 'up', release: 'test-sha' },
    });
  });

  it('reports database up and down without leaking errors', async () => {
    const prisma = {
      ping: jest.fn().mockResolvedValue(undefined),
    } as unknown as PrismaService;
    const indicator = new DatabaseHealthIndicator(healthIndicator, prisma);

    await expect(indicator.check()).resolves.toEqual({
      application: { status: 'up' },
    });

    (prisma.ping as jest.Mock).mockRejectedValueOnce(new Error('secret'));
    await expect(indicator.check()).resolves.toEqual({
      database: { status: 'down' },
    });
  });

  it('composes live and ready checks', async () => {
    const application = {
      check: jest.fn().mockReturnValue({ application: { status: 'up' } }),
    } as unknown as ApplicationHealthIndicator;
    const database = {
      check: jest.fn().mockResolvedValue({ database: { status: 'up' } }),
    } as unknown as DatabaseHealthIndicator;
    const health = {
      check: jest
        .fn()
        .mockImplementation(async (checks: Array<() => Promise<unknown>>) =>
          Promise.all(checks.map((check) => check())),
        ),
    } as unknown as HealthCheckService;
    const controller = new HealthController(health, application, database);

    await expect(controller.liveness()).resolves.toHaveLength(1);
    await expect(controller.readiness()).resolves.toHaveLength(2);
    expect(database.check).toHaveBeenCalledTimes(1);
  });
});
