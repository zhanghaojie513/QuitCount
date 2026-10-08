import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { ApplicationHealthIndicator } from './application-health.indicator';
import { DatabaseHealthIndicator } from './database-health.indicator';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly application: ApplicationHealthIndicator,
    private readonly database: DatabaseHealthIndicator,
  ) {}

  @Get('live')
  @HealthCheck()
  liveness() {
    return this.health.check([() => Promise.resolve(this.application.check())]);
  }

  @Get('ready')
  @HealthCheck()
  readiness() {
    return this.health.check([
      () => Promise.resolve(this.application.check()),
      () => this.database.check(),
    ]);
  }
}
