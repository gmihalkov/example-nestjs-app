import { Expose, Type } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

import { Config } from '@/common/config';

/**
 * The configuration of the main application module.
 */
export class AppConfig extends Config {
  /**
   * The port on which the application is running.
   */
  @Expose({ name: 'PORT' })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  public readonly port!: number;
}
