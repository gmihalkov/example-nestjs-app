import { createParamDecorator } from '@nestjs/common';

import { CurrentAuthTokenHelper } from '@/modules/auth';

import type { CurrentAuthUserGuard } from '../guards/current-auth-user.guard';

/**
 * The parameter that injects a currently authorized user.
 *
 * @requires {@link CurrentAuthUserGuard}
 */
export const CurrentAuthUserParam = createParamDecorator((_, context) => {
  return CurrentAuthTokenHelper.getFromContext(context);
});
