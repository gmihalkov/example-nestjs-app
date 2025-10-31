import { type INestApplication, Module, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppConfig } from './app.config';
import { ConfigModule } from './common/config';
import { AuthModule } from './modules/auth';
import { HealthModule } from './modules/health';
import { UserModule } from './modules/user';
import { typeOrmOptions } from './typeorm.options';

/**
 * The main application module.
 */
@Module({
  imports: [
    // Import and set up the third-party modules.
    TypeOrmModule.forRoot(typeOrmOptions),

    ConfigModule.register([AppConfig]),

    // Import the application modules.
    HealthModule,
    AuthModule,
    UserModule,
  ],
})
export class AppModule {
  /**
   * Creates and sets up the Nest.js application from this module.
   */
  public static async createApp(): Promise<INestApplication> {
    const app = await NestFactory.create(this, new FastifyAdapter());
    this.setupApp(app);

    return app;
  }

  /**
   * Sets the given Nest.js application up.
   *
   * @param app
   * The Nest.js application.
   */
  public static setupApp(app: INestApplication): void {
    app.enableCors();

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );
  }
}
