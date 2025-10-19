import { DataSource } from 'typeorm';

/**
 * The data source that the TypeORM CLI uses to generate and run migrations.
 * 
 * NB. We can use can use environment variables defined in `.env` and `.env.local` here because
 * TypeORM CLI uses `ts-node` under the hood.
 */
export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  database: process.env.POSTGRES_DATABASE,
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  entities: ['./src/**/*.model.ts'],
  migrations: ['./src/migrations/*.ts']
});
