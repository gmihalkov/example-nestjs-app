import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { HealthController } from './controllers/health.controller';
import { RedisHealthIndicator } from './indicators/redis-health.indicator';

/**
 * The module that is responsible for the application health-check. It exposes the `/health` API
 * endpoint that returns a current application availability status.
 */
@Module({
  imports: [TerminusModule, HttpModule],
  controllers: [HealthController],
  providers: [RedisHealthIndicator],
})
export class HealthModule {}
