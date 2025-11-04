import { Global, Module, type OnModuleDestroy } from '@nestjs/common';
import RedisClient from 'ioredis';

import { InjectRedisClient } from './decorators/inject-redis-client.decorator';
import { RedisConfig } from './redis.config';
import { REDIS_CLIENT } from './tokens/redis-client.token';

/**
 * The global module that exports a configured Redis client.
 */
@Global()
@Module({
  exports: [REDIS_CLIENT],
  providers: [
    RedisConfig.PROVIDER,
    {
      provide: REDIS_CLIENT,
      inject: [RedisConfig],
      useFactory: (config: RedisConfig) =>
        new RedisClient({
          host: config.redisHost,
          port: config.redisPort,
          username: config.redisUsername,
          password: config.redisPassword,
        }),
    },
  ],
})
export class RedisModule implements OnModuleDestroy {
  /**
   * The Redis client.
   */
  @InjectRedisClient()
  private readonly redis!: RedisClient;

  /**
   * @inheritdoc
   */
  public async onModuleDestroy(): Promise<void> {
    await this.redis.quit();
  }
}
