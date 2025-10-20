import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModel } from './models/user.model';

/**
 * The module that is responsible for application user management.
 */
@Module({
  imports: [TypeOrmModule.forFeature([UserModel])],
})
export class UserModule {}
