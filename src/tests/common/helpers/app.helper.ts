import type { TestContext } from 'node:test';

import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AppModule } from '@/app.module';

/**
 * The helper that contains methods to manage the application-under-test.
 */
export class AppHelper {
  /**
   * Creates and sets up the application-under-test in the passed test context. It also adds into
   * the test context `before` and `after` hooks that initializes and gracefully closes the
   * application correspondingly.
   *
   * @param context
   * The Node.js test runner context.
   *
   * @returns
   * An application-under-test.
   */
  public static async create(context: TestContext): Promise<INestApplication> {
    const testModule = await Test.createTestingModule({ imports: [AppModule] }).compile();

    const application = testModule.createNestApplication();
    AppModule.setupApp(application);

    context.before(async () => {
      await application.listen(0);
    });

    context.after(async () => {
      await application.close();
    });

    return application;
  }
}
