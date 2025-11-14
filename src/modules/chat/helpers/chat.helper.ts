import type { ExecutionContext } from '@nestjs/common';

import type { ChatModel } from '../models/chat.model';

/**
 * The helper containing the methods to work with chats.
 */
export class ChatHelper {
  /**
   * Returns a chat model stored in the execution context.
   *
   * @param context
   * The current execution context.
   *
   * @returns
   * A chat model or `undefined` if there is no chat model.
   */
  public static getFromContext(context: ExecutionContext): ChatModel | undefined {
    // TODO: Implement.
    Boolean(context);

    return undefined;
  }
}
