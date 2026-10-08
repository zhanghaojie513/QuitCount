import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { ApplicationHealthIndicator } from './application-health.indicator';
import { DatabaseHealthIndicator } from './database-health.indicator';
import { HealthController } from './health.controller';

@Module({
  imports: [
    TerminusModule.forRoot({
      errorLogStyle: 'json',
    }),
  ],
  controllers: [HealthController],
  providers: [ApplicationHealthIndicator, DatabaseHealthIndicator],
})
export class HealthModule {}
