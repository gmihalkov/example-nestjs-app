import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ChatModel } from './chat.model';
import { ChatParticipantModel } from './chat-participant.model';

/**
 * The model that represents a chat message in the database.
 */
@Entity({
  comment: 'Contains chat messages.',
  name: 'chat_messages',
})
export class ChatMessageModel {
  /**
   * The chat message ID.
   */
  @PrimaryGeneratedColumn({
    comment: 'The chat message ID.',
    name: 'id',
  })
  public id!: number;

  /**
   * ID of the chat to which the message belongs.
   */
  @Column({
    comment: 'ID of the chat to which the message belongs.',
    name: 'chat_id',
  })
  public chatId!: number;

  /**
   * ID of the chat participant who wrote the message.
   */
  @Column({
    comment: 'ID of the participant who wrote the message.',
    name: 'chat_participant_id',
  })
  public participantId!: number;

  /**
   * The time when the message was written.
   */
  @Column({
    comment: 'The time when the message was written.',
    name: 'created_at',
  })
  public createdAt!: Date;

  /**
   * The message text.
   */
  @Column({
    comment: 'The message text.',
    name: 'text',
  })
  public text!: string;

  /**
   * Reference to the chat model.
   */
  @ManyToOne(() => ChatModel, { lazy: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chat_id' })
  public chat!: Promise<ChatModel>;

  /**
   * Reference to the chat participant model.
   */
  @ManyToOne(() => ChatParticipantModel, { lazy: true })
  @JoinColumn({ name: 'chat_participant_id' })
  public participant!: Promise<ChatParticipantModel>;
}
