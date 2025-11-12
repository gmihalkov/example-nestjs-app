import { Module } from '@nestjs/common';

import { AuthConfig } from './auth.config';
import { AuthController } from './controllers/auth.controller';

/**
 * The module that is responsible for authentication and authorization.
 */
@Module({
  controllers: [AuthController],
  providers: [AuthConfig.PROVIDER],
})
export class AuthModule {}
