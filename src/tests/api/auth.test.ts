import { test } from 'node:test';

import { AppHelper, HttpHelper } from '@/tests/common';

/**
 * The test suite that tests the authentication & authorization controller.
 */
test('API /auth', async (scope) => {
  /**
   * The application-under-test.
   */
  const app = await AppHelper.create(scope);
  const http = HttpHelper.createAgent(app);

  /**
   * The test suite that tests the signing up by password endpoint.
   */
  await scope.test('POST /auth/sign-up-by-password', async (endpoint) => {
    Boolean(endpoint);

    const baseRequest = http.post('/auth/sign-up-by-password');

    const response = await baseRequest.send({
      username: 'foo@bar.baz',
      verificationCode: '123456',
    });

    console.log(response.body);
  });
});
