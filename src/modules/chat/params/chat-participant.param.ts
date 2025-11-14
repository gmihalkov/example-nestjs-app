import { createParamDecorator } from '@nestjs/common';

import type { ChatParticipantGuard } from '../guards/chat-participant.guard';
import { ChatParticipantHelper } from '../helpers/chat-participant.helper';

/**
 * Injects the current chat participant model into the method parameters.
 *
 * @requires {@link ChatParticipantGuard}
 */
export const ChatParticipantParam = createParamDecorator((_, context) => {
  return ChatParticipantHelper.getFromContext(context);
});
