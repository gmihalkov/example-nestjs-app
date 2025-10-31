const { resolve } = require('node:path');

const { config } = require('dotenv');

const projectRoot = __dirname;
const baseFile = resolve(projectRoot, '.env');
const overridesFile = resolve(projectRoot, '.env.local');

config({
  path: [overridesFile, baseFile],
  quiet: true,
});

module.exports = {
  apps : [
    {
      name: 'app',
      script: './src/index.ts',
      interpreter: 'node',
      node_args: "-r ts-node/register",
      exec_mode: 'cluster',
      instances: Number(process.env.PM2_INSTANCES),
    }
  ],
};
