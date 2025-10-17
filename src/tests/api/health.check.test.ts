import assert from 'node:assert';
import { test } from 'node:test';

import { TestApp } from '../common/test-app';

/**
 * The suite that tests a controller that is responsible for an application health-check.
 */
test('API /health', async (scope) => {
  /**
   * The application-under-test.
   */
  const app = await TestApp.create(scope);

  /**
   * The suite that tests an endpoint that returns a current health-check status.
   */
  await scope.test('GET /health', async (endpoint) => {
    const baseRequest = app.http.endpoint('get', '/health');

    /**
     * Checks if the endpoint returns a correct HTTP response.
     */
    await endpoint.test('it should return a current health-check statuses', async () => {
      const response = await baseRequest.send();
      response.expectToBeOk(200);

      const data = response.parseAsJson();

      assert.partialDeepStrictEqual(data, {
        status: 'ok',
        error: {},
        details: {},
        info: {
          'internet-connection': {
            status: 'up',
          },
        },
      });
    });
  });
});
