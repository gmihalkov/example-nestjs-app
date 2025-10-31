import { applyDecorators, Inject } from '@nestjs/common';

import { REDIS_CLIENT } from '../tokens/redis-client.token';

/**
 * The decorator that injects a globally defined Redis client.
 *
 * @returns
 * A decorator.
 */
export const InjectRedisClient = () => applyDecorators(Inject(REDIS_CLIENT));
