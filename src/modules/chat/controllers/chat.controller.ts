import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

import { ApiController } from '@/common/swagger';
import { AuthSessionGuard, type AuthSessionModel, AuthSessionParam } from '@/modules/auth';

import { ChatDto } from '../dtos/chat.dto';
import { ChatCreateParamsDto } from '../dtos/chat-create-params.dto';
import { ChatParticipantDto } from '../dtos/chat-participant.dto';
import { ChatParticipantAddParamsDto } from '../dtos/chat-participant-add-params.dto';
import { ChatRoute } from '../enums/chat-route.enum';
import { ChatGuard } from '../guards/chat.guard';
import { ChatParticipantGuard } from '../guards/chat-participant.guard';
import type { ChatModel } from '../models/chat.model';
import type { ChatParticipantModel } from '../models/chat-participant.model';
import { ChatParam } from '../params/chat.param';
import { ChatParticipantParam } from '../params/chat-participant.param';

/**
 * The controller that serves the chat endpoints.
 */
@ApiController({
  title: '💬 Chat management',
  description: `
    <p>The group of endpoints to manage chats and their related entities such as messages or
    participants.</p>
  `.trim(),
})
@Controller(ChatRoute.INDEX)
export class ChatController {
  /**
   * Returns a list of chats matching the passed criteria.
   *
   * @param session
   * The current auth session containing the current user.
   */
  @Get(ChatRoute.CHATS)
  @ApiOperation({
    summary: 'Get chats',
    description: `
      <p>Returns a list of chats matching the passed criteria.</p>
      <p>The regular user can see only the chats where he participates. The root user can see all
      chats in the system.</p>
    `.trim(),
  })
  @ApiOkResponse({
    type: ChatDto,
    isArray: true,
  })
  @UseGuards(AuthSessionGuard())
  public async getChats(@AuthSessionParam() session: AuthSessionModel): Promise<ChatDto[]> {
    // TODO: Implement.
    Boolean(session);

    throw new Error('Not implemented');
  }

  /**
   * Creates a new chat with the given parameters.
   *
   * @param params
   * The chat parameters.
   *
   * @param session
   * The current auth session.
   */
  @Post(ChatRoute.CHATS)
  @ApiOperation({
    summary: 'Create a chat',
    description: `
      <p>Creates a chat with the passed parameters and returns it.</p>
    `.trim(),
  })
  @ApiCreatedResponse({ type: ChatDto })
  @ApiBody({ type: ChatCreateParamsDto })
  @UseGuards(AuthSessionGuard())
  public async createChat(
    @Body() params: ChatCreateParamsDto,
    @AuthSessionParam() session: AuthSessionModel,
  ): Promise<ChatDto> {
    // TODO: Implement.
    Boolean(params);
    Boolean(session);

    throw new Error('Not implemented');
  }

  /**
   * Returns a chat by its ID.
   *
   * @param chat
   * The chat to be returned.
   */
  @Get(ChatRoute.CHAT)
  @ApiOperation({
    summary: 'Get a chat',
    description: `
      <p>Returns the chat by its ID.</p>
      <p>A regular user can obtain only his chats. The root user can get any chat.</p>
    `.trim(),
  })
  @ApiParam({
    name: ChatRoute.CHAT_ID,
    description: 'The chat ID.',
    type: Number,
  })
  @ApiOkResponse({ type: ChatDto })
  @UseGuards(AuthSessionGuard(), ChatGuard())
  public getChat(@ChatParam() chat: ChatModel): Promise<ChatDto> {
    // TODO: Implement.
    Boolean(chat);

    throw new Error('Not implemented.');
  }

  /**
   * Deletes a chat with the passed ID.
   *
   * @param chat
   * The chat to be deleted.
   */
  @Delete(ChatRoute.CHAT)
  @ApiOperation({
    summary: 'Delete a chat',
    description: `
      <p>Deletes a chat with a passed ID.</p>
      <p>A regular user can delete only that chats which are created by him. The root user can
      delete any chat.</p>
    `.trim(),
  })
  @ApiParam({
    name: ChatRoute.CHAT_ID,
    description: 'The chat ID.',
    type: Number,
  })
  @ApiNoContentResponse()
  @UseGuards(AuthSessionGuard(), ChatGuard())
  public deleteChat(@ChatParam() chat: ChatModel): Promise<void> {
    // TODO: Implement.
    Boolean(chat);

    throw new Error('Not implemented');
  }

  /**
   * Returns a list of chat participants.
   *
   * @param chat
   * The chat which participants we need to return.
   */
  @Get(ChatRoute.CHAT_PARTICIPANTS)
  @ApiOperation({
    summary: 'List chat participants',
    description: `
      <p>Returns a list of chat participants.</p>
      <p>A regular user can see only his chats' participants. The root user can see participants of
      any chat.</p>
    `.trim(),
  })
  @ApiOkResponse({
    type: ChatParticipantDto,
    isArray: true,
  })
  @ApiParam({
    name: ChatRoute.CHAT_ID,
    description: 'The chat ID.',
    type: Number,
  })
  @UseGuards(AuthSessionGuard(), ChatGuard())
  public async getChatParticipants(@ChatParam() chat: ChatModel): Promise<ChatParticipantDto[]> {
    // TODO: Implement.
    Boolean(chat);

    throw new Error('Not implemented');
  }

  /**
   * Adds participants to the passed chat.
   *
   * @param chat
   * The chat to which we need to add participants.
   *
   * @param params
   * The parameters of the new participants.
   *
   * @returns
   * A list of added participants.
   */
  @Post(ChatRoute.CHAT_PARTICIPANTS)
  @ApiOperation({
    summary: 'Add chat participants',
    description: `
      <p>Adds new participants to the chat.</p>
      <p>Only chat's creator or admins can add new participants. The root user can add participants
      to any chat.</p>
    `.trim(),
  })
  @ApiParam({
    name: ChatRoute.CHAT_ID,
    description: 'The chat ID.',
    type: Number,
  })
  @ApiBody({ type: ChatParticipantAddParamsDto })
  @ApiCreatedResponse({
    type: ChatParticipantDto,
    isArray: true,
  })
  @UseGuards(AuthSessionGuard(), ChatGuard())
  public async addChatParticipants(
    @ChatParam() chat: ChatModel,
    @Body() params: ChatParticipantAddParamsDto,
  ): Promise<ChatParticipantDto[]> {
    // TODO: Implement.
    Boolean(params);
    Boolean(chat);

    throw new Error('Not implemented');
  }

  /**
   * Returns a chat participant by its ID.
   *
   * @param participant
   * The chat participant model to be returned to the client.
   */
  @Get(ChatRoute.CHAT_PARTICIPANT)
  @ApiOperation({
    summary: 'Get a chat participant',
    description: `
      <p>Returns a chat participant by its ID.</p>
      <p>A regular user can see participants only that chats in which he participates. The root
      user can see any chat participants.</p>
    `.trim(),
  })
  @ApiParam({
    name: ChatRoute.CHAT_ID,
    description: 'The chat ID.',
    type: Number,
  })
  @ApiParam({
    name: ChatRoute.CHAT_PARTICIPANT_ID,
    description: 'The chat participant ID.',
    type: Number,
  })
  @ApiOkResponse({ type: ChatParticipantDto })
  @UseGuards(AuthSessionGuard(), ChatGuard(), ChatParticipantGuard())
  public async getChatParticipant(
    @ChatParticipantParam() participant: ChatParticipantModel,
  ): Promise<ChatParticipantDto> {
    // TODO: Implement.
    Boolean(participant);

    throw new Error('Not implemented');
  }

  /**
   * Deletes a chat participant by its ID.
   *
   * @param participant
   * The participant to be deleted.
   */
  @Delete(ChatRoute.CHAT_PARTICIPANT)
  @ApiOperation({
    summary: 'Delete a chat participant',
    description: `
      <p>Deletes a chat participant by its ID.</p>
      <p>Only chat creator or admins can delete participants. The root user can delete anyone.</p>
    `.trim(),
  })
  @ApiParam({
    name: ChatRoute.CHAT_ID,
    description: 'The chat ID.',
    type: Number,
  })
  @ApiParam({
    name: ChatRoute.CHAT_PARTICIPANT_ID,
    description: 'The chat participant ID.',
    type: Number,
  })
  @UseGuards(AuthSessionGuard(), ChatGuard(), ChatParticipantGuard())
  public async deleteChatParticipant(
    @ChatParticipantParam() participant: ChatParticipantModel,
  ): Promise<void> {
    // TODO: Implement.
    Boolean(participant);
  }
}
