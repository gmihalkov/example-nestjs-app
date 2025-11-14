import type { ExecutionContext } from '@nestjs/common';

import type { AuthSessionModel } from '../models/auth-session.model';

/**
 * The helper containing the methods to work with auth sessions.
 */
export class AuthSessionHelper {
  /**
   * Tries to get the auth session from the current execution context.
   *
   * @param context
   * The execution context.
   *
   * @returns
   * A session or `undefined` if the context contains no session.
   */
  public static getFromContext(context: ExecutionContext): AuthSessionModel | undefined {
    // TODO: Implement.
    Boolean(context);

    return undefined;
  }

  /**
   * Puts the given session into the current execution context.
   *
   * @param context
   * The execution context.
   *
   * @param session
   * The session to be stored.
   */
  public static putToContext(context: ExecutionContext, session: AuthSessionModel): void {
    // TODO: Implement.
    Boolean(context);
    Boolean(session);
  }
}
