import type { ExecutionContext } from '@nestjs/common';

import { ExecutionContextHelper } from '@/common/execution-context';

import type { UserModel } from '../models/user.model';

/**
 * The helper that works with the currently authorized user.
 */
export class CurrentAuthUserHelper {
  /**
   * The key under which the currently authorized user is stored in the execution context.
   */
  private static KEY = 'current_auth_user';

  /**
   * Returns a currently authorized user stored in the given execution context or `undefined`, if
   * there is no stored user.
   *
   * @param context
   * The execution context.
   *
   * @returns
   * A user model or `undefined`.
   */
  public static getFromContext(context: ExecutionContext): UserModel | undefined {
    return ExecutionContextHelper.getMeta<UserModel>(context, this.KEY);
  }

  /**
   * Puts the currently authorized user into the execution context.
   *
   * @param context
   * The execution context.
   *
   * @param user
   * The user to be stored.
   */
  public static putToContext(context: ExecutionContext, user: UserModel): void {
    ExecutionContextHelper.setMeta(context, this.KEY, user);
  }
}
