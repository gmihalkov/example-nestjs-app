import { Module } from '@nestjs/common';

import { ChatController } from './controllers/chat.controller';

/**
 * The module that is responsible for chat management.
 */
@Module({
  controllers: [ChatController],
})
export class ChatModule {}
