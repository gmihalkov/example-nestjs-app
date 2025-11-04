import { type INestApplication, Module, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';

import { MailerModule } from '@/common/mailer';
import { RedisModule } from '@/common/redis';
import { TypeOrmModule } from '@/common/typeorm';
import { AuthModule } from '@/modules/auth';
import { HealthModule } from '@/modules/health';
import { UserModule } from '@/modules/user';

import { AppConfig } from './app.config';

/**
 * The main application module.
 */
@Module({
  imports: [TypeOrmModule, RedisModule, MailerModule, HealthModule, AuthModule, UserModule],
  exports: [AppConfig],
  providers: [AppConfig.PROVIDER],
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
