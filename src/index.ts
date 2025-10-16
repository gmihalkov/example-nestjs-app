import { setTimeout } from 'node:timers/promises';

let isStopped = false;

async function start(): Promise<void> {
  if (isStopped) {
    return;
  }

  console.log('Hello World');

  await setTimeout(250);
  await start();
}

function stop(): void {
  isStopped = true;
}

process.on('SIGTERM', stop);
process.on('SIGINT', stop);
process.on('SIGUSR1', stop);
process.on('SIGUSR2', stop);

(async () => {
  await start();
})();
