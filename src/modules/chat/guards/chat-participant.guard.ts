import { type CanActivate, type ExecutionContext, mixin, type Type } from '@nestjs/common';

import type { AuthSessionGuard } from '@/modules/auth';

import type { ChatGuard } from './chat.guard';

/**
 * Returns a guard that takes a chat participant ID from the URL and puts the corresponding model
 * into the current execution context. If the chat participant not found, throws a `NotFound`
 * exception.
 *
 * @requires {@link AuthSessionGuard}
 * @requires {@link ChatGuard}
 *
 * @returns
 * A guard.
 */
export const ChatParticipantGuard = (): Type<CanActivate> => {
  class ChatParticipantMixin implements CanActivate {
    /**
     * @inheritdoc
     */
    public async canActivate(context: ExecutionContext): Promise<boolean> {
      // TODO: Implement.
      Boolean(context);

      throw new Error('Not implemented');
    }
  }

  return mixin(ChatParticipantMixin);
};
