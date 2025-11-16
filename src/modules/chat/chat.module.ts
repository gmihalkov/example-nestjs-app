import { Module } from '@nestjs/common';

import { AuthModule } from '../auth';
import { ChatController } from './controllers/chat.controller';

/**
 * The module that is responsible for chat management.
 */
@Module({
  imports: [AuthModule],
  controllers: [ChatController],
})
export class ChatModule {}
