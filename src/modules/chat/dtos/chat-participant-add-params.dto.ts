import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsInt, IsPositive } from 'class-validator';

/**
 * The DTO class that describes parameters to add chat participants.
 */
@ApiSchema({})
export class ChatParticipantAddParamsDto {
  /**
   * IDs of the users to be added to the chat.
   */
  @ApiProperty({
    description: 'ID of the users to be added to the chat. Cannot be empty.',
    isArray: true,
    minItems: 1,
  })
  @Expose()
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  public userIds!: number[];
}
