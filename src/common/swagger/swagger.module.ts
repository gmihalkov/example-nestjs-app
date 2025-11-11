import { type INestApplication, Module } from '@nestjs/common';
import { DiscoveryModule, Reflector } from '@nestjs/core';

import { SwaggerController } from './controllers/swagger.controller';
import type { SwaggerOptions as Options } from './entities/swagger-options.entity';
import { SwaggerService } from './services/swagger.service';

/**
 * The module that is responsible for an OpenAPI documentation.
 */
@Module({
  controllers: [SwaggerController],
  providers: [SwaggerService],
  imports: [Reflector, DiscoveryModule],
})
export class SwaggerModule {
  /**
   * Initializes an Open API documentation for the given Nest.js application.
   *
   * @param app
   * The Nest.js application.
   *
   * @param options
   * The OpenAPI spec options.
   */
  public static initialize(app: INestApplication, options: Options): void {
    const service = app.get(SwaggerService);
    service.setup(app, options);
  }
}
