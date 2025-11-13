import { ApiProperty, ApiSchema } from '@nestjs/swagger';

/**
 * The DTO class describing the response when the signing up of the new user is verified and
 * completed.
 */
@ApiSchema({})
export class AuthSignUpByPasswordVerifyResultDto {
  /**
   * The issued authorization token.
   */
  @ApiProperty({
    description: 'The token to be inserted into <code>Authorization: Bearer [token]</code>.',
  })
  public accessToken!: string;
}
