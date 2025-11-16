import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthConfig } from './auth.config';
import { AuthController } from './controllers/auth.controller';
import { AuthSessionModel } from './models/auth-session.model';
import { AuthService } from './services/auth.service';
import { AuthSessionService } from './services/auth-session.service';

/**
 * The module that is responsible for authentication and authorization.
 */
@Module({
  imports: [TypeOrmModule.forFeature([AuthSessionModel])],
  controllers: [AuthController],
  providers: [AuthConfig.PROVIDER, AuthSessionService, AuthService],
  exports: [AuthConfig, AuthSessionService, AuthService],
})
export class AuthModule {}
