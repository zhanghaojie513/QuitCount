import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HealthIndicatorService } from '@nestjs/terminus';

@Injectable()
export class ApplicationHealthIndicator {
  constructor(
    private readonly healthIndicator: HealthIndicatorService,
    private readonly config: ConfigService,
  ) {}

  check() {
    return this.healthIndicator.check('application').up({
      release: this.config.get<string>('app.releaseSha', 'local'),
    });
  }
}
