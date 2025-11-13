import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsDate, IsInt, IsPositive } from 'class-validator';

/**
 * The DTO class describes a response when the signing up of the new user is started.
 */
@ApiSchema({})
export class AuthSignUpByPasswordStartResultDto {
  /**
   * The time when the verification had been sent to the user's email.
   */
  @ApiProperty({
    description: "The time when the verification code was sent to the user's email.",
  })
  @Expose()
  @Type(() => Date)
  @IsDate()
  public verificationCodeCreatedAt!: Date;

  /**
   * Describes how long the sent verification code will be active in seconds.
   */
  @ApiProperty({
    description:
      'The time in seconds how long the sent verification code will be active since the response time.',
  })
  @Expose()
  @IsInt()
  @IsPositive()
  public verificationCodeExpiresIn!: number;

  /**
   * The time when the verification code will expire.
   */
  @ApiProperty({
    description: 'The time when the verification code will expire.',
  })
  @Expose()
  @Type(() => Date)
  @IsDate()
  public verificationCodeExpiresAt!: Date;
}
