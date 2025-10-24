import { partialDeepStrictEqual } from 'node:assert';
import { test } from 'node:test';

import { AppHelper, HttpHelper } from '@/tests/common';

/**
 * The suite that tests a controller that is responsible for an application health-check.
 */
test('API /health', async (scope) => {
  /**
   * The application-under-test.
   */
  const app = await AppHelper.create(scope);
  const http = HttpHelper.createAgent(app);

  /**
   * The suite that tests an endpoint that returns a current health-check status.
   */
  await scope.test('GET /health', async (endpoint) => {
    const request = http.get('/health');

    /**
     * Checks if the endpoint returns a correct HTTP response.
     */
    await endpoint.test('it should return a current health-check statuses', async () => {
      const response = await request.send();
      const json = HttpHelper.getBodyAsJson(response, 200);

      partialDeepStrictEqual(json, {
        status: 'ok',
        error: {},
        details: {},
        info: {
          'internet-connection': {
            status: 'up',
          },
          database: {
            status: 'up',
          },
        },
      });
    });
  });
});
