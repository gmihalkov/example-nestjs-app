import { Inject, Module, type OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

import { ConfigModule } from '@/common/config';

import { RedisConfig } from './redis.config';
import { REDIS_CLIENT } from './tokens/redis-client.token';

/**
 * The module that exports a configured Redis client.
 */
@Module({
  imports: [ConfigModule.register([RedisConfig])],
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [RedisConfig],
      useFactory: (config: RedisConfig) => {
        return new Redis({
          host: config.redisHost,
          port: config.redisPort,
          username: config.redisUsername,
          password: config.redisPassword,
        });
      },
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule implements OnModuleDestroy {
  /**
   * The Redis client.
   */
  @Inject(REDIS_CLIENT)
  private readonly redis!: Redis;

  /**
   * @inheritdoc
   */
  public async onModuleDestroy(): Promise<void> {
    await this.redis.quit();
  }
}
