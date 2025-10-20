import { AssertionError, notStrictEqual, ok, strictEqual } from 'node:assert';

import { type ClassTransformOptions, plainToInstance } from 'class-transformer';
import { type ValidationOptions, validateSync } from 'class-validator';
import type { Response } from 'supertest';

/**
 * Describes options to parse the response as DTO instance.
 */
type DtoOptions = ClassTransformOptions | ValidationOptions;

/**
 * Describes any DTO class.
 */
// biome-ignore lint/suspicious/noExplicitAny: `any` is required here.
type DtoClass = new () => any;

/**
 * The helper that contains methods to work with HTTP responses.
 */
export class HttpResponseHelper {
  /**
   * Checks if the passed response is in JSON, and tries to parse its body. If the response is not
   * in JSON, or doesn't have a body, throws an {@link AssertionError}.
   *
   * @param response
   * The SuperTest response.
   *
   * @returns
   * A parsed response body.
   */
  public static parseAsJson(response: Response): unknown {
    this.expectToHaveContentType(response, 'application/json');
    this.expectToHaveBody(response);

    try {
      return JSON.parse(response.text);
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new AssertionError({ message: error.message, actual: response.text });
      }

      throw error;
    }
  }

  /**
   * Checks if the passed response body is in JSON, and tries to parse it using the specified DTO.
   * If the response is not in JSON, or doesn't have a body, or the body didn't pass the validation,
   * throws an {@link AssertionError}.
   *
   * @param response
   * The SuperTest response.
   *
   * @param dtoClass
   * The DTO class.
   *
   * @param options
   * The optional options to be passed into {@link plainToInstance} and {@link validateSync}.
   *
   * @returns
   * A valid DTO instance.
   */
  public static parseAsDto<T extends DtoClass>(
    response: Response,
    dtoClass: T,
    options: DtoOptions = {},
  ): InstanceType<T> {
    const json = this.parseAsJson(response);

    strictEqual(typeof json, 'object', 'Response body is not an object');
    notStrictEqual(json, null, 'Response body is null');

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

  /**
   * Checks if the passed response has the specified HTTP status, and throws an
   * {@link AssertionError} if it doesn't.
   *
   * @param response
   * The SuperTest response.
   */
  public static expectToHaveStatus(response: Response, status: number): void {
    strictEqual(response.status, status, 'Response status code is invalid');
  }

  /**
   * Checks if the passed response has the specified content type, and throws an
   * {@link AssertionError} if it doesn't.
   *
   * @param response
   * The SuperTest response.
   *
   * @param contentType
   * The content type to check.
   */
  public static expectToHaveContentType(response: Response, contentType: string): void {
    const header = response.headers['content-type'] ?? '';
    const regexp = new RegExp(`^${contentType}\\b`);

    if (regexp.test(header)) {
      return;
    }

    throw new AssertionError({
      message: 'Invalid response\'s "Content-Type"',
      actual: header,
      expected: contentType,
    });
  }

  /**
   * Checks if the passed response has a body, and throws an {@link AssertionError} if it doesn't.
   *
   * @param response
   * The SuperTest response.
   */
  public static expectToHaveBody(response: Response): void {
    ok(response.text, 'Response has no body');
  }
}
