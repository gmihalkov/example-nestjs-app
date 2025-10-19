import type { DynamicModule, Provider } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

import type { AnyDto } from './types/any-dto.type';

/**
 * The module that parses and validates the environment variables as an instance of DTO class,
 * and exports this instance.
 *
 * Using this module, you can define the environment variables that your module uses as a class
 * decorated with decorators from `class-transformer` and `class-validator`, and, then,
 * inject this class as a regular Nest.js provider.
 */
export class ConfigModule {
  /**
   * Creates an instances of the passed classes using {@link plainToInstance}, then validates them
   * using {@link validateSync}, and, finally, exports these instances as providers; so, you can
   * inject them inside your module.
   *
   * @param dtoClasses
   * The list of DTO classes.
   *
   * @returns
   * A dynamic module that exports the DTO instances.
   */
  public static register(dtoClasses: AnyDto[]): DynamicModule {
    const providers: Provider[] = [];

    for (const dtoClass of dtoClasses) {
      const instance = this.createDtoInstance(dtoClass);

      providers.push({
        provide: dtoClass,
        useValue: instance,
      });
    }

    return {
      module: ConfigModule,
      providers,
      exports: dtoClasses,
    };
  }

  /**
   * Creates an instance of the given DTO class and validates it.
   *
   * @param dtoClass
   * The DTO class to create an instance.
   *
   * @returns
   * A valid DTO instance.
   */
  private static createDtoInstance(dtoClass: AnyDto): InstanceType<AnyDto> {
    const instance = plainToInstance(dtoClass, process.env, { excludeExtraneousValues: true });
    const issues = validateSync(instance);

    if (issues.length === 0) {
      return instance;
    }

    const messages = issues.map((issue) => issue.toString());

    const exception = new Error(`Environment variables are invalid:\n${messages.join('\n')}`);
    Error.captureStackTrace(exception, this.register);

    throw exception;
  }
}
