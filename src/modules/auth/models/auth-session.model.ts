import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { UserModel } from '@/modules/user';

/**
 * The model that describes an auth session in the database.
 */
@Entity({
  comment: 'Contains authorization sessions.',
  name: 'auth_sessions',
})
export class AuthSessionModel {
  /**
   * The session ID.
   */
  @PrimaryGeneratedColumn({
    comment: 'The session ID.',
    name: 'id',
  })
  public id!: number;

  /**
   * The time when the session was started.
   */
  @Column({
    comment: 'The time when the session was started.',
    name: 'started_at',
  })
  public startedAt!: Date;

  /**
   * The time when the session will expire.
   */
  @Column({
    comment: 'The time when the session will expire.',
    name: 'expires_at',
  })
  public expiresAt!: Date;

  /**
   * ID of the currently issued access token.
   */
  @Column({
    comment: 'ID of the currently issued access token.',
    name: 'access_token_id',
  })
  public accessTokenId!: number;

  /**
   * ID of the user to which the session belongs.
   */
  @Column({
    comment: 'ID of the user to which the session belongs.',
    name: 'user_id',
  })
  public userId!: number;

  /**
   * Fingerprint of the device to which the session belongs.
   */
  @Column({
    comment: 'Fingerprint of the device to which the session belongs.',
    name: 'device',
  })
  public device!: string;

  /**
   * Reference to the related user model.
   */
  @ManyToOne(() => UserModel, { lazy: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  public user!: Promise<UserModel>;
}
