import { Injectable } from '@nestjs/common';
import { HealthIndicatorService } from '@nestjs/terminus';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class DatabaseHealthIndicator {
  constructor(
    private readonly healthIndicator: HealthIndicatorService,
    private readonly prisma: PrismaService,
  ) {}

  async check() {
    const indicator = this.healthIndicator.check('database');
    try {
      await this.prisma.ping();
      return indicator.up();
    } catch {
      return indicator.down();
    }
  }
}
