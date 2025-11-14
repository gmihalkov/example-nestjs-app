import { type CanActivate, type ExecutionContext, mixin, type Type } from '@nestjs/common';

import type { AuthSessionGuard } from '@/modules/auth';

/**
 * Returns a guard that takes a chat ID from the URL and puts the corresponding model into the
 * current execution context. If the chat not found, throws a `NotFound` exception.
 *
 * @requires {@link AuthSessionGuard}
 *
 * @returns
 * A guard.
 */
export const ChatGuard = (): Type<CanActivate> => {
  class ChatMixin implements CanActivate {
    /**
     * @inheritdoc
     */
    public async canActivate(context: ExecutionContext): Promise<boolean> {
      // TODO: Implement.
      Boolean(context);

      throw new Error('Not implemented');
    }
  }

  return mixin(ChatMixin);
};
