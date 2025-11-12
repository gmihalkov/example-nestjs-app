import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

/**
 * The DTO that describes parameters needed to start the signing up process.
 */
@ApiSchema({})
export class AuthSignUpByPasswordStartParamsDto {
  /**
   * The username (i.e., email).
   */
  @ApiProperty({
    description: 'The username. Must be a valid email address.',
  })
  @Expose()
  @IsEmail()
  public username!: string;

  /**
   * The password.
   */
  @ApiProperty({
    description: 'The desired password. Must contain at least 6 characters.',
  })
  @Expose()
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  public password?: string;
}
