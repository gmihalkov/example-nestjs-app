import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import type { ApiControllerOptions as Options } from '../entities/api-controller-options.entity';
import { SwaggerMetadata } from '../enums/swagger-metadata.enum';

/**
 * Returns a decorator that adds to the controller it's human-readable name and description.
 *
 * @param options
 * The documentation options.
 *
 * @returns
 * A controller decorator.
 */
export const ApiController = (options: Options): ClassDecorator => {
  return applyDecorators(
    ApiTags(options.title),
    SetMetadata(SwaggerMetadata.API_CONTROLLER, options),
  );
};
