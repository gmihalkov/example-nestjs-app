import { createParamDecorator } from '@nestjs/common';

import type { ChatGuard } from '../guards/chat.guard';
import { ChatHelper } from '../helpers/chat.helper';

/**
 * Injects the current chat model into the method parameters.
 *
 * @requires {@link ChatGuard}
 */
export const ChatParam = createParamDecorator((_, context) => {
  return ChatHelper.getFromContext(context);
});
