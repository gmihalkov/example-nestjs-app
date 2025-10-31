import { Global, Module } from '@nestjs/common';
import { TypeOrmModule as TypeOrm } from '@nestjs/typeorm';

import { TypeOrmConfig } from './typeorm.config';

/**
 * The TypeORM configuration.
 */
const config = TypeOrmConfig.create();

/**
 * The global TypeORM module.
 */
@Global()
@Module({
  imports: [TypeOrm.forRoot(config.dataSourceOptions)],
})
export class TypeOrmModule {}
