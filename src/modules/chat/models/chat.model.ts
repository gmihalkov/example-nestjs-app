import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { ChatParticipantModel } from './chat-participant.model';

/**
 * The model that represents a chat in the database.
 */
@Entity({
  comment: 'Contains the chats.',
  name: 'chats',
})
export class ChatModel {
  /**
   * The chat ID.
   */
  @PrimaryGeneratedColumn({
    comment: 'The chat ID.',
    name: 'id',
  })
  public id!: number;

  /**
   * The time when the chat was created.
   */
  @Column({
    comment: 'The time when the chat was created.',
    name: 'created_at',
  })
  public createdAt!: Date;

  /**
   * The time when the chat was ended. Can be `undefined` for chats which are going now.
   */
  @Column({
    comment: 'The time when the chat was ended.',
    name: 'ended_at',
  })
  public endedAt?: Date;

  /**
   * Reference to the chat's participants.
   */
  @OneToMany(
    () => ChatParticipantModel,
    (participant) => participant.chat,
  )
  public participants!: Promise<ChatParticipantModel[]>;
}
