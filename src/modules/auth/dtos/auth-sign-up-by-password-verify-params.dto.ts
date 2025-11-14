import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * The DTO that describes parameters needed to verify and complete the signing up process.
 */
@ApiSchema({})
export class AuthSignUpByPasswordVerifyParamsDto {
  /**
   * The verification token sent to the user's email.
   */
  @ApiProperty({
    description: "The verification token sent to the user's email.",
  })
  @Expose()
  @IsString()
  @IsNotEmpty()
  public verificationToken?: string;
}
