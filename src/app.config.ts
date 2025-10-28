import { resolve } from 'node:path';

import { Expose, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

/**
 * An absolute path to the project's root folder.
 */
const PROJECT_ROOT = process.cwd();

/**
 * The configuration of the main application module.
 */
export class AppConfig {
  /**
   * The port on which the application is running.
   */
  @Expose({ name: 'PORT' })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  public readonly port!: number;

  /**
   * The hostname of Postgres database (e.g., `"localhost"`, `"postgres.com"`, or `"127.0.0.1"`).
   */
  @Expose({ name: 'POSTGRES_HOST' })
  @IsString()
  @IsNotEmpty()
  public readonly postgresHost!: string;

  /**
   * The port number of Postgres database (e.g., `5432`).
   */
  @Expose({ name: 'POSTGRES_PORT' })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  public readonly postgresPort!: number;

  /**
   * The username to access Postgres database (e.g., `"postgres"`).
   */
  @Expose({ name: 'POSTGRES_USERNAME' })
  @IsString()
  @IsNotEmpty()
  public readonly postgresUsername!: string;

  /**
   * The password to access Postgres database (can be an empty string).
   */
  @Expose({ name: 'POSTGRES_PASSWORD' })
  @IsString()
  public readonly postgresPassword!: string;

  /**
   * The Postgres database name.
   */
  @Expose({ name: 'POSTGRES_DATABASE' })
  @IsString()
  @IsNotEmpty()
  public readonly postgresDatabase!: string;

  /**
   * A glob pattern of the files containing the TypeORM entity definitions (relative).
   */
  @Expose({ name: 'TYPEORM_ENTITIES_PATH' })
  @IsString()
  @IsNotEmpty()
  private readonly typeormEntitiesRelativePath!: string;

  /**
   * A glob pattern of the files containing the TypeORM entity definitions.
   */
  public get typeormEntitiesPath(): string {
    return resolve(PROJECT_ROOT, this.typeormEntitiesRelativePath);
  }

  /**
   * A glob pattern of the TypeORM migration files (relative).
   */
  @Expose({ name: 'TYPEORM_MIGRATIONS_PATH' })
  @IsString()
  @IsNotEmpty()
  private readonly typeormMigrationsRelativePath!: string;

  /**
   * A glob pattern of the files containing the TypeORM entity definitions.
   */
  public get typeormMigrationsPath(): string {
    return resolve(PROJECT_ROOT, this.typeormMigrationsRelativePath);
  }
}
