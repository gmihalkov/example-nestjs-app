import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

/**
 * The DTO that describes parameters needed to verify and complete the signing up process.
 */
@ApiSchema({})
export class AuthSignUpByPasswordVerifyParamsDto {
  /**
   * The username (i.e., email).
   */
  @ApiProperty({
    description: 'The email to which the verification code was sent.',
  })
  @Expose()
  @IsString()
  @IsNotEmpty()
  public username!: string;

  /**
   * The verification code sent to the user's email.
   */
  @ApiProperty({
    description: 'The verification code itself. Must be a 6-digits string.',
  })
  @Expose()
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{6}$/)
  public verificationCode?: string;
}
