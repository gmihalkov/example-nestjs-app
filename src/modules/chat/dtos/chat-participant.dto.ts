import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean, IsInt, IsPositive } from 'class-validator';

import type { ChatParticipantModel } from '../models/chat-participant.model';

/**
 * The DTO properties.
 */
type Props = Pick<ChatParticipantModel, 'id' | 'chatId' | 'userId' | 'isAdmin' | 'isCreator'>;

/**
 * The DTO class that describes a chat participant to be return to the client.
 */
@ApiSchema({})
export class ChatParticipantDto implements Props {
  /**
   * @inheritdoc
   */
  @ApiProperty({
    description: 'The participant ID.',
  })
  @Expose()
  @IsInt()
  @IsPositive()
  public id!: number;

  /**
   * @inheritdoc
   */
  @ApiProperty({
    description: 'ID of the user which the participant is.',
  })
  @Expose()
  @IsInt()
  @IsPositive()
  public userId!: number;

  /**
   * @inheritdoc
   */
  @ApiProperty({
    description: 'ID of the chat to which the participant belongs.',
  })
  @Expose()
  @IsInt()
  @IsPositive()
  public chatId!: number;

  /**
   * @inheritdoc
   */
  @ApiProperty({
    description: "Indicates if the participant is a chat's creator.",
  })
  @Expose()
  @IsBoolean()
  public isCreator!: boolean;

  /**
   * @inheritdoc
   */
  @ApiProperty({
    description: "Indicates if the participant is a chat's administrator.",
  })
  @Expose()
  @IsBoolean()
  public isAdmin!: boolean;
}
