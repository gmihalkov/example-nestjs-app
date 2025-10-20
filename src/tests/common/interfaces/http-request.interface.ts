/**
 * Describes an HTTP request to the application-under-test.
 */
export interface HttpRequest {
  /**
   * The request's HTTP method.
   *
   * @default 'get'
   */
  method?: 'delete' | 'patch' | 'post' | 'put' | 'get';

  /**
   * The request's HTTP headers.
   *
   * @default {}
   */
  headers?: Record<string, string | number | boolean | undefined>;

  /**
   * The request URL's path (e.g., `'/v1/auth/sign-in'`). The path shouldn't contain `?queryString`
   * or `#anchor`.
   *
   * @default '/'
   */
  pathname?: string;

  /**
   * The request's body.
   */
  body?: string;

  /**
   * The request's query string parameters.
   *
   * @default {}
   */
  query?: Record<string, string | number | boolean | undefined>;
}
