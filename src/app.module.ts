import { type INestApplication, Module, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

/**
 * The main application module.
 */
@Module({})
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
  private static setupApp(app: INestApplication): void {
    app.enableCors();
    app.enableShutdownHooks();

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );
  }
}
