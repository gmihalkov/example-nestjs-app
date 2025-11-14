import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDate, IsInt, IsOptional, IsPositive } from 'class-validator';

import type { ChatModel } from '../models/chat.model';

/**
 * The DTO properties.
 */
type Props = Pick<ChatModel, 'id' | 'createdAt' | 'endedAt'>;

/**
 * The DTO class that describes a chat as we return it to the client.
 */
@ApiSchema({
  description: `Describes a chat.`,
})
export class ChatDto implements Props {
  /**
   * @inheritdoc
   */
  @ApiProperty({
    description: 'The chat ID.',
  })
  @Expose()
  @IsInt()
  @IsPositive()
  public id!: number;

  /**
   * @inheritdoc
   */
  @ApiProperty({
    description: 'The time when the chat was created.',
  })
  @Expose()
  @IsDate()
  public createdAt!: Date;

  /**
   * @inheritdoc
   */
  @ApiProperty({
    description: "The time when the chat was ended. It's undefined for the going chats.",
    required: false,
  })
  @Expose()
  @IsOptional()
  @IsDate()
  public endedAt?: Date;
}
