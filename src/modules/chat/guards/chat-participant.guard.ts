import { ok } from 'node:assert';

import {
  type CanActivate,
  type ExecutionContext,
  mixin,
  NotFoundException,
  type Type,
} from '@nestjs/common';

import { type AuthSessionGuard, AuthSessionHelper } from '@/modules/auth';

import { ChatHelper } from '../helpers/chat.helper';
import { ChatParticipantHelper } from '../helpers/chat-participant.helper';
import type { ChatParticipantModel } from '../models/chat-participant.model';
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
      const participantId = this.getParticipantId(context);
      ok(participantId, 'ChatRoute.CHAT_PARTICIPANT_ID is required');

      const session = AuthSessionHelper.getFromContext(context);
      ok(session, 'AuthSessionGuard is required');

      const chat = ChatHelper.getFromContext(context);
      ok(chat, 'ChatGuard is required');

      const [user, participants] = await Promise.all([session.user, chat.participants]);

      const participant = participants.find((item) => item.id === participantId);

      if (!participant) {
        throw new NotFoundException();
      }

      if (user.isRoot) {
        this.saveParticipant(context, participant);

        return true;
      }

      const participates = participants.some((item) => item.userId === user.id);

      if (!participates) {
        return false;
      }

      this.saveParticipant(context, participant);

      return true;
    }

    /**
     * Returns a chat participant ID from the current URL. If the URL has no chat ID, or it's
     * invalid, returns `undefined`.
     *
     * @param context
     * The execution context.
     */
    private getParticipantId(context: ExecutionContext): number | undefined {
      // TODO: Implement.
      Boolean(context);

      throw new Error('Not implemented');
    }

    /**
     * Puts the given chat participant into the current execution context.
     *
     * @param context
     * The execution context.
     *
     * @param participant
     * The chat participant to be stored.
     */
    private saveParticipant(context: ExecutionContext, participant: ChatParticipantModel): void {
      ChatParticipantHelper.putToContext(context, participant);
    }
  }

  return mixin(ChatParticipantMixin);
};
