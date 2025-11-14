import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { UserModel } from '@/modules/user';

import { ChatModel } from './chat.model';

/**
 * The model that represents a chat participant as it stored in the database.
 */
@Entity({
  comment: 'Contains the chat participants.',
  name: 'chat_participants',
})
export class ChatParticipantModel {
  /**
   * The chat participant ID.
   */
  @PrimaryGeneratedColumn({
    comment: 'The chat participant ID.',
    name: 'id',
  })
  public id!: number;

  /**
   * ID of the chat to which the participant belongs.
   */
  @Column({
    comment: 'ID of the chat to which the participant belongs.',
    name: 'chat_id',
  })
  public chatId!: number;

  /**
   * ID of the user which the participant is.
   */
  @Column({
    comment: 'ID of the user which the participant is.',
    name: 'user_id',
  })
  public userId!: number;

  /**
   * Indicates if the participant is a chat's creator.
   */
  @Column({
    comment: "Indicates if the participant is a chat's creator.",
    name: 'is_creator',
  })
  public isCreator!: boolean;

  /**
   * Indicates if the participant is a chat's administrator. The creator must be an administrator
   * by default. His permission cannot be revoked by someone else.
   */
  @Column({
    comment: "Indicates if the participant is a chat's administrator.",
    name: 'is_admin',
  })
  public isAdmin!: boolean;

  /**
   * Reference to the chat model.
   */
  @ManyToOne(() => ChatModel, { lazy: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chat_id' })
  public chat!: Promise<ChatModel>;

  /**
   * Reference to the user model.
   */
  @ManyToOne(() => UserModel, { lazy: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  public user!: Promise<UserModel>;
}
