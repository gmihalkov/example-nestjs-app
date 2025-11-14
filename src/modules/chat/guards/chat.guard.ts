import { ok } from 'node:assert';

import {
  type CanActivate,
  type ExecutionContext,
  mixin,
  NotFoundException,
  type Type,
} from '@nestjs/common';

import { AuthSessionGuard, AuthSessionHelper } from '@/modules/auth';

import { ChatHelper } from '../helpers/chat.helper';
import type { ChatModel } from '../models/chat.model';

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
      const chatId = this.getChatId(context);
      ok(chatId, 'ChatRoute.CHAT_ID is required');

      const session = AuthSessionHelper.getFromContext(context);
      ok(session, 'AuthSessionGuard is required');

      const chat = await this.findChat(chatId);

      if (!chat) {
        throw new NotFoundException();
      }

      const user = await session.user;

      if (user.isRoot) {
        this.saveChat(context, chat);

        return true;
      }

      const participants = await chat.participants;
      const participates = participants.some((item) => item.userId === user.id);

      if (!participates) {
        return false;
      }

      this.saveChat(context, chat);

      return true;
    }

    /**
     * Returns a chat ID from the current URL. If the URL has no chat ID, or it's invalid, returns
     * `undefined`.
     *
     * @param context
     * The execution context.
     */
    private getChatId(context: ExecutionContext): number | undefined {
      // TODO: Implement.
      Boolean(context);

      throw new Error('Not implemented');
    }

    /**
     * Tries to find a chat by the given ID.
     *
     * @param chatId
     * The chat ID.
     *
     * @returns
     * A chat or `null` if the chat not found.
     */
    private async findChat(chatId: number): Promise<ChatModel | null> {
      // TODO: Implement.
      Boolean(chatId);

      throw new Error('Not implemented');
    }

    /**
     * Puts the given chat into the current execution context.
     *
     * @param context
     * The execution context.
     *
     * @param chat
     * The chat to be stored.
     */
    private saveChat(context: ExecutionContext, chat: ChatModel): void {
      ChatHelper.putToContext(context, chat);
    }
  }

  return mixin(ChatMixin);
};
