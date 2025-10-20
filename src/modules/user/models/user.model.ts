import { Entity, PrimaryGeneratedColumn } from 'typeorm';

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
    type: 'integer',
  })
  public id!: number;
}
