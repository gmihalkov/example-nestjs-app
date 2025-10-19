import { AppConfig } from './app.config';
import { AppModule } from './app.module';

/**
 * Indicates that the application was started in the `dry-run` mode.
 */
const isDryRun = process.argv.includes('--dry-run');

/**
 * The application entry point.
 */
(async () => {
  const app = await AppModule.createApp();

  if (isDryRun) {
    await app.init();
    await app.close();

    process.exit(0);
  }

  const config = app.get(AppConfig);

  app.listen(config.port, () => {
    console.log(`The application is running at http://localhost:${config.port}`);
  });
})();
