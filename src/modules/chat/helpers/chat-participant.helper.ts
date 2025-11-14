import type { ExecutionContext } from '@nestjs/common';

import type { ChatParticipantModel } from '../models/chat-participant.model';

/**
 * The helper containing the methods to work with chat participants.
 */
export class ChatParticipantHelper {
  /**
   * Returns a chat participant model stored in the execution context.
   *
   * @param context
   * The current execution context.
   *
   * @returns
   * A chat participant model or `undefined` if there is no chat model.
   */
  public static getFromContext(context: ExecutionContext): ChatParticipantModel | undefined {
    // TODO: Implement.
    Boolean(context);

    return undefined;
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
  public static putToContext(context: ExecutionContext, participant: ChatParticipantModel): void {
    // TODO: Implement.
    Boolean(context);
    Boolean(participant);
  }
}
