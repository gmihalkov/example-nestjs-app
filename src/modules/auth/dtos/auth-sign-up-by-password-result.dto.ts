import { ApiProperty, ApiSchema } from '@nestjs/swagger';

/**
 * The DTO class describing the signing up by password endpoint's response body.
 */
@ApiSchema({})
export class AuthSignUpByPasswordResultDto {
  /**
   * The issued authorization token.
   */
  @ApiProperty({
    description: 'The token to be inserted into <code>Authorization: Bearer [token]</code>.',
  })
  public token!: string;
}
