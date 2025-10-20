import { type INestApplication, Module, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule } from '@/common/config';

import { AppConfig } from './app.config';
import { AuthModule } from './modules/auth';
import { HealthModule } from './modules/health';
import { UserModule } from './modules/user';

/**
 * The main application module.
 */
@Module({
  imports: [
    ConfigModule.register([AppConfig]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.register([AppConfig])],
      inject: [AppConfig],
      useFactory: (config: AppConfig) => ({
        type: 'postgres',
        autoLoadEntities: true,
        host: config.postgresHost,
        port: config.postgresPort,
        database: config.postgresDatabase,
        username: config.postgresUsername,
        password: config.postgresPassword,
      }),
    }),
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
    const app = await NestFactory.create(this);
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
