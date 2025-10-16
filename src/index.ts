import { ok } from 'node:assert';

import { AppModule } from './app.module';

const isDryRun = process.argv.includes('--dry-run');

function getPort(): number {
  const text = process.env.PORT;
  ok(text, new Error('The required "PORT" env variable is missing'));

  const exception = new Error(
    `The "PORT" env variable must be a positive integer number; got "${text}"`,
  );

  const port = Number(text);

  ok(!Number.isNaN(port), exception);
  ok(port > 0, exception);
  ok(port % 1 === 0, exception);

  return port;
}

(async () => {
  const app = await AppModule.createApp();

  if (isDryRun) {
    await app.init();
    await app.close();

    return;
  }

  const port = getPort();

  app.listen(port, () => {
    console.log(`The application is running at http://localhost:${port}`);
  });
})();
