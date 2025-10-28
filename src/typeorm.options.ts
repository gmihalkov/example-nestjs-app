import type { DataSourceOptions } from 'typeorm';

import { ConfigHelper } from '@/common/config';

import { AppConfig } from './app.config';

/**
 * The instance containing an application configuration.
 */
const config = ConfigHelper.create(AppConfig);

/**
 * The TypeORM data source options. Describes the Postgres connection settings, and the TypeORM
 * entity and migration paths.
 */
export const typeOrmOptions: DataSourceOptions = {
  type: 'postgres',
  host: config.postgresHost,
  port: config.postgresPort,
  database: config.postgresDatabase,
  username: config.postgresUsername,
  password: config.postgresPassword,
  entities: [config.typeormEntitiesPath],
  migrations: [config.typeormMigrationsPath],
};
