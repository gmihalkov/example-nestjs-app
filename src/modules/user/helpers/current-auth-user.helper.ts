import type { ExecutionContext } from '@nestjs/common';

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
    const type = context.getType();

    switch (type) {
      case 'http': {
        const request = context.switchToHttp().getRequest();
        const state = request.state ?? {};

        return state[this.KEY];
      }

      case 'ws': {
        const client = context.switchToWs().getClient();
        const data = client.data ?? {};

        return data[this.KEY];
      }

      default: {
        throw new Error(`${type} is not supported`);
      }
    }
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
    const type = context.getType();

    switch (type) {
      case 'http': {
        const request = context.switchToHttp().getRequest();
        const state = request.state ?? {};

        state[this.KEY] = user;
        request.state = state;

        break;
      }

      case 'ws': {
        const client = context.switchToWs().getClient();
        const data = client.data ?? {};

        data[this.KEY] = user;
        client.data = data;

        break;
      }

      default: {
        throw new Error(`${type} is not supported`);
      }
    }
  }
}
