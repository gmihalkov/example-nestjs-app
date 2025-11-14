import { createParamDecorator } from '@nestjs/common';

import type { AuthSessionGuard } from '../guards/auth-session.guard';
import { AuthSessionHelper } from '../helpers/auth-session.helper';

/**
 * Injects the current auth session into method's parameters.
 *
 * @requires {@link AuthSessionGuard}
 */
export const AuthSessionParam = createParamDecorator((_, context) => {
  return AuthSessionHelper.getFromContext(context);
});
