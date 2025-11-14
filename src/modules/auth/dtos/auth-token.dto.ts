import { Expose } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

/**
 * The DTO class that describes an authorization JWT payload.
 */
export class AuthTokenDto {
  /**
   * The JWT's subject. Usually, it is an auth session's ID.
   */
  @Expose()
  @IsInt()
  @IsPositive()
  public sub!: number;

  /**
   * The token ID.
   */
  @Expose()
  @IsInt()
  @IsPositive()
  public jti!: number;
}
