import { Expose, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

import { Config } from '@/common/config';

/**
 * The mailer configuration.
 */
export class MailerConfig extends Config {
  /**
   * The SMTP server hostname (without a prefix).
   */
  @Expose({ name: 'SMTP_HOST' })
  @IsString()
  @IsNotEmpty()
  public readonly smtpHost!: string;

  /**
   * The SMTP server port.
   */
  @Expose({ name: 'SMTP_PORT' })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  public readonly smtpPort!: number;

  /**
   * The SMTP server user name.
   */
  @Expose({ name: 'SMTP_USERNAME' })
  @IsString()
  public readonly smtpUsername!: string;

  /**
   * The SMTP server user password.
   */
  @Expose({ name: 'SMTP_PASSWORD' })
  @IsString()
  public readonly smtpPassword!: string;
}
