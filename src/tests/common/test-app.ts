import { resolve } from 'node:path';
import type { TestContext } from 'node:test';

import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { AppModule } from '@/app.module';

import { TestHttpRequest } from './test-http-request';

/**
 * The entity that is our application, but ran in memory.
 */
export class TestApp {
  /**
   * Creates an instance of our application mocking some modules and providers.
   */
  public static async create(scope: TestContext): Promise<TestApp> {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      /**
       * Override the database connection settings. Here we replace the Postgres with an in-memory
       * SQLite. It allows tests to work faster and don't put a lot of garbage into a developer's
       * local database.
       */
      .overrideProvider(getDataSourceToken())
      .useFactory({
        factory: async () => {
          const dataSource = new DataSource({
            type: 'better-sqlite3',
            database: ':memory:',
            synchronize: true,
            entities: [resolve(process.cwd(), './src/**/*.model.ts')],
          });

          await dataSource.initialize();

          return dataSource;
        },
      })
      .compile();

    const app = moduleRef.createNestApplication();
    AppModule.setupApp(app);

    scope.before(async () => {
      await app.init();
    });

    scope.after(async () => {
      await app.close();
    });

    return new this(app);
  }

  /**
   * Creates an instance of this class with the given test application.
   *
   * @param nest
   * The Nest.js application-under-test.
   */
  protected constructor(public readonly nest: INestApplication) {}

  /**
   * The client to send HTTP requests to the application.
   */
  public get http(): TestHttpRequest {
    return new TestHttpRequest(this, {});
  }
}
