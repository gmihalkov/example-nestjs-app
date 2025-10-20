import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  type Type as Mixin,
  mixin,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { type CurrentAuthTokenGuard, CurrentAuthTokenHelper } from '@/modules/auth';

import { CurrentAuthUserHelper } from '../helpers/current-auth-user.helper';
import { UserModel } from '../models/user.model';

/**
 * Describes the options to configure a guard.
 */
type Options = {
  /**
   * Indicates that the request must be declined if the current user is not found.
   *
   * @default true
   */
  required?: boolean;
};

/**
 * Returns a guard that takes the stored authorization token from the current execution context,
 * and tries to find a corresponding application user. If it's found, the guard stores it into the
 * execution context; otherwise, denies the request.
 *
 * @requires {@link CurrentAuthTokenGuard}
 *
 * @param options
 * The options to configure the guard.
 *
 * @returns
 * A current user guard.
 */
export const CurrentAuthUserGuard = (options: Options = {}): Mixin<CanActivate> => {
  const { required = true } = options;

  /**
   * The current user guard.
   */
  @Injectable()
  class CurrentAuthUserMixin implements CanActivate {
    /**
     * The repository containing the users.
     */
    @InjectRepository(UserModel)
    private readonly users!: Repository<UserModel>;

    /**
     * @inheritdoc
     */
    public async canActivate(context: ExecutionContext): Promise<boolean> {
      const existingUser = CurrentAuthTokenHelper.getFromContext(context);

      if (existingUser) {
        return true;
      }

      const token = CurrentAuthTokenHelper.getFromContext(context);

      if (!token) {
        return !required;
      }

      const user = await this.users.findOneBy({ id: token.sub });

      if (!user) {
        return !required;
      }

      CurrentAuthUserHelper.putToContext(context, user);

      return true;
    }
  }

  return mixin(CurrentAuthUserMixin);
};
