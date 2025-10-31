import { Expose, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

import { Config } from '@/common/config';

/**
 * The Redis module configuration.
 */
export class RedisConfig extends Config {
  /**
   * The Redis server host (without a port).
   */
  @Expose({ name: 'REDIS_HOST' })
  @IsString()
  @IsNotEmpty()
  public readonly redisHost!: string;

  /**
   * The Redis server port.
   */
  @Expose({ name: 'REDIS_PORT' })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  public readonly redisPort!: number;

  /**
   * The Redis user name.
   */
  @Expose({ name: 'REDIS_USERNAME' })
  @IsString()
  public readonly redisUsername!: string;

  /**
   * The Redis user password.
   */
  @Expose({ name: 'REDIS_PASSWORD' })
  @IsString()
  public readonly redisPassword!: string;
}
