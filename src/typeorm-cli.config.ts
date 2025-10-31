import { DataSource } from 'typeorm';

import { TypeOrmConfig } from '@/common/typeorm';

/**
 * The TypeORM configuration.
 */
const config = TypeOrmConfig.create();

/**
 * The data source that the TypeORM CLI uses to generate and run migrations. Uses the same settings
 * as the application.
 */
export default new DataSource(config.dataSourceOptions);
