import { Injectable } from '@nestjs/common';

import { ConfigHelper } from '../helpers/config.helper';
import type { AnyDto } from '../types/any-dto.type';

/**
 * The base class of any configuration DTO.
 */
@Injectable()
export class Config {
  /**
   * Creates an instance of this configuration DTO.
   *
   * @returns
   * A valid DTO instance.
   */
  public static create<T extends AnyDto>(this: T): InstanceType<T> {
    return ConfigHelper.create(this);
  }
}
