import { Controller, Get, Inject } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

import { RedisHealthIndicator } from '../indicators/redis-health.indicator';

/**
 * The controller that returns a current health-check status.
 */
@Controller('/health')
export class HealthController {
  /**
   * The built-in health-check service.
   */
  @Inject(HealthCheckService)
  private readonly healthCheck!: HealthCheckService;

  /**
   * The service that checks if the application can send HTTP requests to the external resources.
   */
  @Inject(HttpHealthIndicator)
  private readonly http!: HttpHealthIndicator;

  /**
   * The service that checks if the database is available.
   */
  @Inject(TypeOrmHealthIndicator)
  private readonly database!: TypeOrmHealthIndicator;

  /**
   * The service that checks if the Redis is available.
   */
  @Inject(RedisHealthIndicator)
  private readonly redis!: RedisHealthIndicator;

  /**
   * Checks the application services and returns a result of this check.
   */
  @Get()
  @HealthCheck()
  public async check(): Promise<unknown> {
    return this.healthCheck.check([
      // Checks if the application is able to send HTTP requests to the external resources.
      () => this.http.pingCheck('internet-connection', 'http://1.1.1.1'),
      // Checks if the database is accessible.
      () => this.database.pingCheck('database'),
      // Checks if the Redis accessible.
      () => this.redis.pingCheck('redis'),
    ]);
  }
}
