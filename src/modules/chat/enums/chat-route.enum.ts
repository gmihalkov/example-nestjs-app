/**
 * The enum that contains the chat module routes.
 */
export enum ChatRoute {
  /**
   * The index route.
   */
  INDEX = '/chats',

  /**
   * The key by which the chat ID is stored.
   */
  CHAT_ID = ':chatId',

  /**
   * The key by which the chat participant ID is stored.
   */
  CHAT_PARTICIPANT_ID = ':chatParticipantId',

  /**
   * The key by which the chat message ID is stored.
   */
  CHAT_MESSAGE_ID = ':chatMessageId',

  /**
   * The route of chat list.
   */
  CHATS = '/',

  /**
   * The route of a single chat.
   */
  CHAT = '/:chatId',

  /**
   * The route of the chat participant list.
   */
  CHAT_PARTICIPANTS = '/:chatId/participants',

  /**
   * The route of a single chat participant.
   */
  CHAT_PARTICIPANT = '/:chatId/participants/:chatParticipantId',

  /**
   * The route of the chat message list.
   */
  CHAT_MESSAGES = '/:chatId/messages',

  /**
   * The route of a single chat message.
   */
  CHAT_MESSAGE = '/:chatId/messages/:chatMessageId',
}
