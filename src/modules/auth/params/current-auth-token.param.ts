import { createParamDecorator } from '@nestjs/common';

import type { CurrentAuthTokenGuard } from '../guards/current-auth-token.guard';
import { CurrentAuthTokenHelper } from '../helpers/current-auth-token.helper';

/**
 * The parameter that injects a current authorization token.
 *
 * @requires {@link CurrentAuthTokenGuard}
 */
export const CurrentAuthTokenParam = createParamDecorator((_, context) => {
  return CurrentAuthTokenHelper.getFromContext(context);
});
