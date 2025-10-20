import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * The authorization module configuration.
 */
export class AuthConfig {
  /**
   * The authorization JWT signature.
   */
  @Expose({ name: 'AUTH_TOKEN_SIGNATURE' })
  @IsString()
  @IsNotEmpty()
  public readonly tokenSignature!: string;
}
