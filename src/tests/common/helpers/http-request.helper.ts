import type { INestApplication } from '@nestjs/common';
import type { Response, Test } from 'supertest';
import supertest from 'supertest';
import { UnreachableCaseError } from 'ts-essentials';

import type { HttpRequest } from '../interfaces/http-request.interface';

/**
 * The helper that contains methods to construct and send HTTP requests to the
 * application-under-test.
 */
export class HttpRequestHelper {
  /**
   * Sends the given HTTP request to the application via SuperTest, and returns its response.
   *
   * @param app
   * The application-under-test.
   *
   * @param request
   * The HTTP request.
   *
   * @returns
   * A SuperTest response object.
   */
  public static send(app: INestApplication, request: HttpRequest): Promise<Response> {
    const testRequest = this.compileTestRequest(app, request);

    return testRequest.send();
  }

  /**
   * Compiles a SuperTest request that is supposed to send the passed HTTP request to the specified
   * application-under-test. It compiles the request's URL, and selects a proper HTTP method, and
   * returns the resulting object.
   *
   * @param app
   * The application-under-test.
   *
   * @param request
   * The HTTP request to be sent.
   *
   * @returns
   * A SuperTest request object.
   */
  private static compileTestRequest(app: INestApplication, request: HttpRequest): Test {
    const server = app.getHttpServer();
    const client = supertest(server);

    const method = request.method ?? 'get';
    const url = this.compileUrl(request);

    switch (method) {
      case 'delete': {
        return client.delete(url);
      }

      case 'patch': {
        return client.patch(url);
      }

      case 'post': {
        return client.post(url);
      }

      case 'put': {
        return client.put(url);
      }

      case 'get': {
        return client.get(url);
      }

      default: {
        throw new UnreachableCaseError(method);
      }
    }
  }

  /**
   * Compiles the {@link HttpRequest.pathname|path} and {@link HttpRequest.query|query} into
   * the complete URL.
   *
   * @param request
   * The HTTP request.
   *
   * @returns
   * A compiled URL to send the request.
   */
  private static compileUrl(request: HttpRequest): string {
    const searchParams = new URLSearchParams();

    const queryParams = request.query ?? {};
    const names = Object.keys(queryParams);

    for (const name of names) {
      const value = queryParams[name];

      if (value === undefined) {
        continue;
      }

      searchParams.set(name, String(value));
    }

    const pathname = request.pathname?.replace(/\/$/g, '') || '/';
    const query = searchParams.toString();

    let result = pathname;

    if (query) {
      result += `?${query}`;
    }

    return result;
  }
}
