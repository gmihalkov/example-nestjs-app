import { applyDecorators } from '@nestjs/common';
import { ApiBody, type ApiBodyOptions, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';

/**
 * Describes the decorator options.
 */
type Options = ApiBodyOptions & {
  /**
   * The list of DTO classes describing the possible body shapes.
   */
  // biome-ignore lint/complexity/noBannedTypes: `Function` is required here.
  types: Function[];
};

/**
 * Returns a decorator which tells OpenAPI that the method's body is a one of the following DTO's.
 *
 * @param options
 * The decorator options.
 *
 * @returns
 * A method decorator.
 */
export const ApiBodyOneOf = (options: Options): MethodDecorator => {
  const { types, description, required } = options;

  const oneOf = types.map((type) => ({ $ref: getSchemaPath(type) }));

  return applyDecorators(
    ApiExtraModels(...types),
    ApiBody({
      description,
      required,
      schema: { oneOf },
    }),
  );
};
