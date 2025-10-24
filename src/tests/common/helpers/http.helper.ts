import { AssertionError, ok, strictEqual } from 'node:assert';

import type { INestApplication } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import type { Agent, Response } from 'superagent';
import request from 'supertest';
import { UnreachableCaseError } from 'ts-essentials';

/**
 * Describes an expected response status.
 *
 * - `'ok'` means that the status should be less than 400;
 * - `'error'` means that the status should be greater than or equal to 400;
 * - the number means the exact match.
 */
type ExpectedStatus = 'ok' | 'error' | number;

/**
 * Describes any DTO class.
 */
// biome-ignore lint/suspicious/noExplicitAny: `any` is required here.
type DtoClass = new () => any;

/**
 * The helper that contains the methods to work with HTTP requests and responses.
 */
export class HttpHelper {
  /**
   * Creates an HTTP agent that simulates an HTTP connection to the passed application-under-test.
   *
   * @param app
   * The application-under-test to which we want to send requests.
   *
   * @returns
   * An HTTP agent.
   */
  public static createAgent(app: INestApplication): Agent {
    const server = app.getHttpServer();

    return request.agent(server);
  }

  /**
   * Checks if a status of the passed HTTP response is equal to the expected one, and throws
   * an {@link AssertionError} if it's not.
   *
   * @param response
   * The response which status we want to check.
   *
   * @param expectedStatus
   * The status that the request should have.
   */
  public static expectToHaveStatus(response: Response, expectedStatus: ExpectedStatus): void {
    const message = 'The HTTP response has an unexpected status';

    if (typeof expectedStatus === 'number') {
      strictEqual(response.status, expectedStatus, message);

      return;
    }

    switch (expectedStatus) {
      case 'error': {
        ok(response.error, new AssertionError({ message, actual: response.status }));
        break;
      }

      case 'ok': {
        ok(response.ok, new AssertionError({ message, actual: response.status }));
        break;
      }

      default: {
        throw new UnreachableCaseError(expectedStatus);
      }
    }
  }

  /**
   * Tries to parse a body of the passed HTTP response as JSON. If the response has no body,
   * or its "Content-Type" is not "application/json", or its body is not a valid JSON string,
   * throws an {@link AssertionError}.
   *
   * @param response
   * The response which body we want to parse as JSON.
   *
   * @param expectedStatus
   * The optional response status to be checked. Can be one of the three options:
   * - `'ok'` means that the response status must be `< 400`;
   * - `'error'` means that the response status should be `>= 400`;
   * - `<number>` means the exact match.
   *
   * @returns
   * A parsed response body.
   */
  public static getBodyAsJson(response: Response, expectedStatus?: ExpectedStatus): unknown {
    if (expectedStatus !== undefined) {
      this.expectToHaveStatus(response, expectedStatus);
    }

    const contentType = response.headers['Content-Type'] || response.headers['content-type'] || '';

    ok(response.text, 'The HTTP response has no body');
    ok(
      /\bjson\b/.test(contentType),
      new AssertionError({
        message: 'The HTTP response "Content-Type" is not JSON',
        expected: 'application/json',
        actual: contentType,
      }),
    );

    try {
      return JSON.parse(response.text);
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new AssertionError({
          message: `The HTTP response body cannot be parsed as JSON: ${error.message}`,
          actual: response.text,
        });
      }

      throw error;
    }
  }

  /**
   * Tries to parse a body of the passed HTTP response using the provided DTO class. If the response
   * has no body, or its "Content-Type" is not "application/json", or its body is not a valid JSON
   * string, or the body is not an object, or the object didn't pass the validation, throws an
   * {@link AssertionError}.
   *
   * @param response
   * The response which body we want to parse using DTO class.
   *
   * @param dtoClass
   * The DTO class by which we want to parse and validate the response body.
   *
   * @param expectedStatus
   * The optional response status to be checked. Can be one of the three options:
   * - `'ok'` means that the response status must be `< 400`;
   * - `'error'` means that the response status should be `>= 400`;
   * - `<number>` means the exact match.
   *
   * @returns
   * A valid DTO instance.
   */
  public static getBodyAsDto<T extends DtoClass>(
    response: Response,
    dtoClass: T,
    expectedStatus?: ExpectedStatus,
  ): InstanceType<T> {
    const json = this.getBodyAsJson(response, expectedStatus);

    ok(
      typeof json === 'object' && json !== null,
      new AssertionError({
        message: 'The HTTP response body is not an object',
        actual: json,
      }),
    );

    const dto = plainToInstance(dtoClass, json, { excludeExtraneousValues: true });
    const issues = validateSync(dto);

    if (issues.length === 0) {
      return dto;
    }

    const messages = issues.map((issue) => issue.toString()).join('\n');

    throw new AssertionError({
      message: `The HTTP response body didn't pass the validation:\n${messages}`,
      actual: json,
    });
  }
}
