import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsInt, IsPositive } from 'class-validator';

/**
 * The DTO class describing the parameters to create a chat.
 */
@ApiSchema({})
export class ChatCreateParamsDto {
  /**
   * IDs of the users with which this chat is.
   */
  @ApiProperty({
    description: 'IDs of the users with which the chat is. Cannot be empty.',
    minItems: 1,
  })
  @Expose()
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  public userIds!: number[];
}
