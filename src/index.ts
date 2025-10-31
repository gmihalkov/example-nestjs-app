import { AppConfig } from './app.config';
import { AppModule } from './app.module';

/**
 * Indicates that the application was started with the `--dry-run` flag. It means, that we need
 * to start the application and immediately stop it.
 */
const isDryRun = Boolean(process.env.npm_config_dry_run);

/**
 * The application entry point.
 */
(async () => {
  const app = await AppModule.createApp();

  if (isDryRun) {
    await app.listen(0);
    await app.close();

    process.exit(0);
  }

  const config = app.get(AppConfig);

  app.listen(config.port, () => {
    console.log(`The application is running at http://localhost:${config.port}`);
    console.log(`You can check it's health here: http://localhost:${config.port}/health`);
  });
})();
