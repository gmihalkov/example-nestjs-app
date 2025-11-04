import { Global, Module } from '@nestjs/common';
import { TypeOrmModule as TypeOrm } from '@nestjs/typeorm';

import { TypeOrmConfig } from './typeorm.config';

/**
 * The global TypeORM module.
 */
@Global()
@Module({
  providers: [TypeOrmConfig.PROVIDER],
  imports: [
    TypeOrm.forRootAsync({
      extraProviders: [TypeOrmConfig.PROVIDER],
      inject: [TypeOrmConfig],
      useFactory: (config: TypeOrmConfig) => config.dataSourceOptions,
    }),
  ],
})
export class TypeOrmModule {}
