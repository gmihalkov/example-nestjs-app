import type { TestContext } from 'node:test';

import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

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
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

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
