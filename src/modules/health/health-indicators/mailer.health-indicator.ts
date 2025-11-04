import { ok } from 'node:assert';

import { Inject, Injectable } from '@nestjs/common';
import { type HealthIndicatorResult, HealthIndicatorService } from '@nestjs/terminus';
import type { Transport } from 'nodemailer';

import { InjectMailer } from '@/common/mailer';

@Injectable()
export class MailerHealthIndicator {
  /**
   * The terminus health indicator service.
   */
  @Inject(HealthIndicatorService)
  private readonly health!: HealthIndicatorService;

  /**
   * The mailer provider.
   */
  @InjectMailer()
  private readonly mailer!: Transport;

  /**
   * Returns a mailer heath-check status.
   *
   * @param key
   * The service key.
   *
   * @returns
   * A status.
   */
  public async pingCheck(key: string): Promise<HealthIndicatorResult> {
    const indicator = this.health.check(key);

    try {
      ok(this.mailer.verify);
      await this.mailer.verify();

      return indicator.up();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      return indicator.down({ message });
    }
  }
}
