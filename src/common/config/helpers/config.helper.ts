import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

import type { AnyDto } from '../types/any-dto.type';

/**
 * The helper containing the methods to work with configuration DTOs.
 */
export class ConfigHelper {
  /**
   * Creates and validates an instance of the given configuration DTO class, using the current
   * environment variables.
   *
   * @param dtoClass
   * The DTO class which instance we use to parse and validate the environment variables.
   *
   * @returns
   * A valid DTO instance.
   */
  public static create<T extends AnyDto>(dtoClass: T): InstanceType<T> {
    const instance = plainToInstance(dtoClass, process.env, { excludeExtraneousValues: true });
    const issues = validateSync(instance);

    if (issues.length === 0) {
      return instance;
    }

    const messages = issues.map((issue) => issue.toString());

    const exception = new Error(`Environment variables are invalid:\n${messages.join('\n')}`);
    Error.captureStackTrace(exception, this.create);

    throw exception;
  }
}
