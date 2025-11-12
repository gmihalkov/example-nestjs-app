import {
  type ArgumentMetadata,
  Injectable,
  type PipeTransform,
  ValidationPipe,
  type ValidationPipeOptions,
} from '@nestjs/common';

import type { AnyDto } from '../types/any-dto.type';

/**
 * The validation pipe which tries to transform the incoming value using one of the passed DTO
 * classes. If the validation passed, it returns a DTO instance; otherwise, throws an exception
 * like standard `ValidationPipe`.
 */
@Injectable()
export class OneOfPipe implements PipeTransform {
  /**
   * Creates an instance of the pipe with the given parameters.
   *
   * @param dtoClasses
   * The list of DTO classes to validate the input.
   *
   * @param options
   * The validation options.
   */
  public constructor(dtoClasses: AnyDto[], options: ValidationPipeOptions = {}) {
    const { transform = true, ...otherOptions } = options;

    this.pipes = dtoClasses.map(
      (dtoClass) =>
        new ValidationPipe({
          ...otherOptions,
          transform,
          expectedType: dtoClass,
        }),
    );
  }

  /**
   * The native Nest.js validation pipes to check the incoming value against each passed DTO class.
   */
  private readonly pipes: ValidationPipe[] = [];

  /**
   * @inheritdoc
   */
  public async transform(value: unknown, metadata: ArgumentMetadata): Promise<unknown> {
    let firstException: unknown;

    for (const pipe of this.pipes) {
      try {
        return await pipe.transform(value, metadata);
      } catch (exception) {
        firstException ??= exception;
      }
    }

    throw firstException;
  }
}
