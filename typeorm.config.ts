import { DataSource } from 'typeorm';

import { typeOrmOptions } from './src/typeorm.options';

/**
 * The data source that the TypeORM CLI uses to generate and run migrations. Uses the same settings
 * as the application.
 */
export default new DataSource(typeOrmOptions);
