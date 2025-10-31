import { Inject, Injectable } from '@nestjs/common';
import { type HealthIndicatorResult, HealthIndicatorService } from '@nestjs/terminus';
import type Redis from 'ioredis';

import { REDIS_CLIENT } from '@/common/redis';

/**
 * The Redis health indicator.
 */
@Injectable()
export class RedisHealthIndicator {
  /**
   * The terminus health indicator service.
   */
  @Inject(HealthIndicatorService)
  private readonly health!: HealthIndicatorService;

  /**
   * The Redis client.
   */
  @Inject(REDIS_CLIENT)
  private readonly redis!: Redis;

  /**
   * Returns a Redis heath-check status.
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
      await this.redis.ping();
      return indicator.up();
    } catch (_) {
      return indicator.down();
    }
  }
}
