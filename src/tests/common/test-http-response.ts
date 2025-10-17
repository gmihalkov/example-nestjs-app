import { AssertionError, ok } from 'node:assert';

import { type ClassTransformOptions, plainToInstance } from 'class-transformer';
import { type ValidationOptions, validateSync } from 'class-validator';
import type supertest from 'supertest';

/**
 * Describes options to parse the response as DTO instance.
 */
type DtoOptions = ClassTransformOptions | ValidationOptions;

/**
 * The entity that represents an HTTP response from our application.
 */
export class TestHttpResponse {
  /**
   * Creates an instance of the class for the given response.
   *
   * @param response
   * The supertest response.
   */
  public constructor(private readonly response: supertest.Response) {}

  /**
   * Checks if the response status is less than 400, and throws an error if it's not.
   *
   * @param status
   * The optional OK status to extra check the exact match.
   *
   * @throws An {@link AssertionError}
   * if the response status is >= 400; or if the status doesn't match the supplied one.
   */
  public expectToBeOk(status?: number): void {
    const exception = status
      ? `Expect the response status to be ${status}; got ${this.response.status}`
      : `Expect the response status to be OK; got ${this.response.status}`;

    if (status) {
      ok(this.response.status === status, exception);
    } else {
      ok(this.response.ok, exception);
    }
  }

  /**
   * Checks if the response status is greater than or equal to 400, and throws an error if it's not.
   *
   * @param status
   * The optional ERROR status to extra check the exact match.
   *
   * @throws An {@link AssertionError}
   * if the response status is less than 400; or if the status doesn't match the supplied one.
   */
  public expectToBeError(status?: number): void {
    const exception = status
      ? `Expect the response status to be ${status}; got ${this.response.status}`
      : `Expect the response status to be ERROR; got ${this.response.status}`;

    if (status) {
      ok(this.response.status === status, exception);
    } else {
      ok(!this.response.ok, exception);
    }
  }

  /**
   * Parses the response body as JSON and returns it. Throws an assertion error if the response is
   * not in JSON.
   *
   * @returns
   * A parsed value.
   *
   * @throws An {@link AssertionError}
   * if the response "Content-Type" header is not "application/json"; or if the response body is not
   * a valid JSON.
   */
  public parseAsJson(): unknown {
    const contentType = this.response.header['content-type'];

    ok(contentType, `The required "content-type" header is missing in the response`);

    ok(
      /^application\/json\b/g.test(contentType),
      `Expect the response "content-type" to be "application/json"; got "${contentType}`,
    );

    if (this.response.noContent) {
      return;
    }

    try {
      return JSON.parse(this.response.text);
    } catch (_) {
      throw new AssertionError({
        message: `Expect the response body to be JSON; got "${this.response.text}"`,
      });
    }
  }

  /**
   * Parses the response body using the provided DTO instance.
   *
   * @param dtoClass
   * The DTO class to parse the response body.
   *
   * @returns
   * A DTO instance.
   *
   * @throws An {@link AssertionError}
   * if the response "Content-type" header is not "application/json"; or if the response body is
   * not a valid JSON; or if the response data is not an object; or if this object didn't pass
   * the DTO validation.
   */
  // biome-ignore lint/suspicious/noExplicitAny: `any` is required here.
  public parseAsDto<T extends new () => any>(
    dtoClass: T,
    options: DtoOptions = {},
  ): InstanceType<T> {
    const json = this.parseAsJson();

    ok(
      typeof json === 'object' && json !== null,
      `Expect the response body to be an object; got "${this.response.text}"`,
    );

    const instance = plainToInstance(dtoClass, json, options);
    const issues = validateSync(instance, options);

    if (issues.length === 0) {
      return instance;
    }

    const messages = issues.map((issue) => issue.toString()).join('\n');

    throw new AssertionError({
      message: `The response body didn't pass the validation using ${dtoClass.name}:\n${messages}`,
    });
  }
}
