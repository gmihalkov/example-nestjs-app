import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * The authorization module configuration.
 */
export class AuthConfig {
  /**
   * The signature to sign JWT.
   */
  @Expose({ name: 'AUTH_TOKEN_SIGNATURE' })
  @IsString()
  @IsNotEmpty()
  public readonly tokenSignature!: string;
}
