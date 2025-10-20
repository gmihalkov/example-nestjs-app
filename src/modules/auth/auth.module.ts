import { Module } from '@nestjs/common';

import { ConfigModule } from '@/common/config';

import { AuthConfig } from './auth.config';

/**
 * The module that is responsible for authentication and authorization.
 */
@Module({
  imports: [ConfigModule.register([AuthConfig])],
})
export class AuthModule {}
