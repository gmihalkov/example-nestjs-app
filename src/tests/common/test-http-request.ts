import supertest from 'supertest';
import { UnreachableCaseError } from 'ts-essentials';

import type { TestApp } from './test-app';
import { TestHttpResponse } from './test-http-response';

/**
 * Describes an HTTP request method.
 */
type HttpMethod = 'delete' | 'patch' | 'post' | 'put' | 'get';

/**
 * Describes the request parameters.
 */
type Params = {
  /**
   * The request HTTP method.
   *
   * @default 'get'
   */
  method?: HttpMethod;

  /**
   * The request URL's pathname.
   *
   * @default '/'
   */
  path?: string;

  /**
   * The HTTP headers.
   */
  headers?: Record<string, string>;
};

/**
 * The entity that represents an HTTP request to the test application.
 */
export class TestHttpRequest {
  /**
   * The request parameters.
   */
  private readonly params: Required<Params>;

  /**
   * Creates an instance of the request.
   *
   * @param app
   * The test application.
   *
   * @param params
   * The request parameters.
   */
  public constructor(
    private readonly app: TestApp,
    params: Params = {},
  ) {
    const { method = 'get', path = '/', headers = {} } = params;

    this.params = { method, path, headers };
  }

  /**
   * Creates a copy of the given request overriding some parameters.
   *
   * @param params
   * The request parameters to be overridden.
   *
   * @returns
   * A copy of this instance.
   */
  private copy(params: Partial<Params>): this {
    const self = this.constructor as unknown as typeof TestHttpRequest;
    const nextParams = { ...this.params, ...params };

    return new self(this.app, nextParams) as this;
  }

  /**
   * Sets a request HTTP method. Returns a copy of this instance with the updated parameters.
   *
   * @param method
   * The new HTTP method.
   *
   * @returns
   * A copy of the request.
   */
  public method(method: HttpMethod): this {
    return this.copy({ method });
  }

  /**
   * Sets a new URL's pathname. Returns a copy of this instance with the updated parameters.
   *
   * @param path
   * The new pathname.
   *
   * @returns
   * A copy of this request.
   */
  public path(path: string): this {
    return this.copy({ path });
  }

  /**
   * Sets the new request HTTP method and the URL's pathname. Returns a copy of this instance with
   * the updated parameters.
   *
   * @param method
   * The new HTTP method.
   *
   * @param path
   * The new URL's pathname.
   *
   * @returns
   * A copy of this request.
   */
  public endpoint(method: HttpMethod, path: string): this {
    return this.method(method).path(path);
  }

  /**
   * Sets or removes the given HTTP header. Returns a copy of this instance with the updated
   * parameters.
   *
   * @param name
   * The header name.
   *
   * @param value
   * The new header value or `undefined` if you want to delete it.
   *
   * @returns
   * A copy of this instance.
   */
  public header(name: string, value: string | undefined): this {
    let headers: Record<string, string> = {};

    if (value === undefined) {
      headers = { ...this.params.headers };
      delete headers[name];
    } else {
      headers = { ...this.params.headers, [name]: value };
    }

    return this.copy({ headers });
  }

  /**
   * Sends the request.
   */
  public async send(): Promise<TestHttpResponse> {
    const agent = this.createAgent();
    const response = await agent.send();

    return new TestHttpResponse(response);
  }

  /**
   * Creates a Supertest Agent to send the request.
   *
   * @returns
   * A supertest agent.
   */
  private createAgent(): supertest.Test {
    const httpServer = this.app.nest.getHttpServer();
    const client = supertest(httpServer);

    const url = this.compileUrl();

    switch (this.params.method) {
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
        throw new UnreachableCaseError(this.params.method);
      }
    }
  }

  /**
   * Compiles the final request URL.
   */
  private compileUrl(): string {
    return this.params.path;
  }
}
