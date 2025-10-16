import { resolve } from 'node:path';

import { config } from 'dotenv';

const projectRoot = process.cwd();

const baseFile = resolve(projectRoot, '.env');
const overridesFile = resolve(projectRoot, '.env.local');

config({
  path: [overridesFile, baseFile],
  quiet: true,
});
