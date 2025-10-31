import { Module } from '@nestjs/common';

import { AuthConfig } from './auth.config';

/**
 * The module that is responsible for authentication and authorization.
 */
@Module({
  providers: [AuthConfig.PROVIDER],
})
export class AuthModule {}
