import { Global, Module, type OnModuleDestroy } from '@nestjs/common';
import { createTransport, type Transport } from 'nodemailer';

import { InjectMailer } from './decorators/inject-mailer.decorator';
import { MailerConfig } from './mailer.config';
import { MAILER } from './tokens/mailer.token';

/**
 * The global module that is responsible for email sending.
 */
@Global()
@Module({
  providers: [
    MailerConfig.PROVIDER,
    {
      provide: MAILER,
      inject: [MailerConfig],
      useFactory: (config: MailerConfig) =>
        createTransport({
          host: config.smtpHost,
          port: config.smtpPort,
          secure: false,
          auth: {
            user: config.smtpUsername,
            pass: config.smtpPassword,
          },
        }),
    },
  ],
  exports: [MAILER],
})
export class MailerModule implements OnModuleDestroy {
  /**
   * The transport to send emails.
   */
  @InjectMailer()
  private readonly mailer!: Transport;

  /**
   * @inheritdoc
   */
  public async onModuleDestroy(): Promise<void> {
    this.mailer.close?.();
  }
}
