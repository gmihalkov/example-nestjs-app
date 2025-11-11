import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

import { ApiController } from '@/common/swagger';

import { MailerHealthIndicator } from '../health-indicators/mailer.health-indicator';
import { RedisHealthIndicator } from '../health-indicators/redis.health-indicator';

/**
 * The controller that returns a current health-check status.
 */
@Controller('/health')
@ApiController({
  title: '🩺 Application health-check',
  description: `
    <p>Provides a method to check whether the application and its infrastructure are running or not.</p>
  `.trim(),
})
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
   * The service that checks if the mailer is available.
   */
  @Inject(MailerHealthIndicator)
  private readonly mailer!: MailerHealthIndicator;

  /**
   * Checks the application services and returns a result of this check.
   */
  @Get()
  @HealthCheck()
  @ApiOperation({
    summary: 'Check the status',
    description: `
      <p>The endpoint returns the overall application status and the detailed statuses of each
      services on which the application depends.</p>
      <p>It will return you something like:</p>
      <pre>
        {
          "status": "ok",
          "info": {
            "internet-connection": { "status": "up" },
            "database": { "status":"up" }
          },
          "error": {}
        }
      </pre>
      <p>If some of the application's infrastructure is unavailable, its status will be
      <code>"down"</code></p>
    `.trim(),
  })
  public async check(): Promise<unknown> {
    return this.healthCheck.check([
      // Checks if the application is able to send HTTP requests to the external resources.
      () => this.http.pingCheck('internet-connection', 'http://1.1.1.1'),
      // Checks if the database is accessible.
      () => this.database.pingCheck('database'),
      // Checks if the Redis accessible.
      () => this.redis.pingCheck('redis'),
      // Checks if the Mailer is accessible.
      () => this.mailer.pingCheck('mailer'),
    ]);
  }
}
