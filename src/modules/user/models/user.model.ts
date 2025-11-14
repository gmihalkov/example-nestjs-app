import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * The model that represents a user as it stored in the database.
 */
@Entity({
  comment: 'Contains the application users.',
  name: 'users',
})
export class UserModel {
  /**
   * The unique user ID.
   */
  @PrimaryGeneratedColumn({
    comment: 'The unique user ID.',
    name: 'id',
  })
  public id!: number;

  /**
   * The user's email.
   */
  @Column({
    comment: "The user's email.",
    name: 'email',
  })
  public email!: string;

  /**
   * SHA-256 hash of the user's password.
   */
  @Column({
    comment: "SHA-256 hash of the user's password.",
    name: 'password',
  })
  public password!: string;
}
