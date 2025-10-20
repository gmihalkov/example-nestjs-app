import assert from 'node:assert';
import { test } from 'node:test';

import { AppHelper, type HttpRequest, HttpRequestHelper, HttpResponseHelper } from '@/tests/common';

/**
 * The suite that tests a controller that is responsible for an application health-check.
 */
test('API /health', async (scope) => {
  /**
   * The application-under-test.
   */
  const app = await AppHelper.create(scope);

  /**
   * The suite that tests an endpoint that returns a current health-check status.
   */
  await scope.test('GET /health', async (endpoint) => {
    const request: HttpRequest = {
      method: 'get',
      pathname: '/health',
    };

    /**
     * Checks if the endpoint returns a correct HTTP response.
     */
    await endpoint.test('it should return a current health-check statuses', async () => {
      const response = await HttpRequestHelper.send(app, request);
      HttpResponseHelper.expectToHaveStatus(response, 200);

      const data = HttpResponseHelper.parseAsJson(response);

      assert.partialDeepStrictEqual(data, {
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
