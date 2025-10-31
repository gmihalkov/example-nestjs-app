import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

import { Config } from '@/common/config';

/**
 * The authorization module configuration.
 */
export class AuthConfig extends Config {
  /**
   * The signature to sign JWT.
   */
  @Expose({ name: 'AUTH_TOKEN_SIGNATURE' })
  @IsString()
  @IsNotEmpty()
  public readonly tokenSignature!: string;
}
