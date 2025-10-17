import { Controller, Get, Inject } from '@nestjs/common';
import { HealthCheck, HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';

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
   * Checks the application services and returns a result of this check.
   */
  @Get()
  @HealthCheck()
  public async check(): Promise<unknown> {
    return this.healthCheck.check([
      // Checks if the application is able to send HTTP requests to the external resources.
      () => this.http.pingCheck('internet-connection', 'http://1.1.1.1'),
    ]);
  }
}
