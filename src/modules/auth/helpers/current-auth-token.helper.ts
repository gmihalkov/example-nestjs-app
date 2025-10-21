import type { ExecutionContext } from '@nestjs/common';

import { ExecutionContextHelper } from '@/common/execution-context';

import type { AuthTokenDto } from '../dto/auth-token.dto';

/**
 * The helper that works with the current authorization token stored in the execution context.
 */
export class CurrentAuthTokenHelper {
  /**
   * Returns an "Authorization" string from the current execution context. If the current execution
   * context is HTTP, it will return an "Authorization" header. If it is WS, it will return
   * `client.handshake.auth.token`.
   *
   * If the header or the handshake token is not set or contains an empty string, it will return
   * `undefined`.
   *
   * @param context
   * The current execution context.
   *
   * @returns
   * A string or `undefined`.
   */
  public static getJwtFromContext(context: ExecutionContext): string | undefined {
    const type = context.getType();

    switch (type) {
      case 'http': {
        return this.getJwtFromHttpContext(context);
      }

      case 'ws': {
        return this.getJwtFromWsContext(context);
      }

      default: {
        throw new Error(`${type} is not supported`);
      }
    }
  }

  /**
   * Returns an authorization token from the incoming HTTP request. If there is no Authorization
   * header, or its value is invalid, returns `undefined`.
   *
   * @param context
   * The execution context.
   *
   * @returns
   * A token or `undefined`.
   */
  private static getJwtFromHttpContext(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();
    const headers = request.headers ?? {};

    const authorization = headers.authorization || headers.Authorization || undefined;

    if (!authorization) {
      return undefined;
    }

    const protocol = 'Bearer ';

    if (!authorization.startsWith(protocol)) {
      return undefined;
    }

    const token = authorization.substring(protocol.length);

    return token || undefined;
  }

  /**
   * Returns an authorization token from the given incoming WS message. If the client didn't send
   * a token at handshake, returns `undefined`.
   *
   * @param context
   * The execution context.
   *
   * @returns
   * A token or `undefined`.
   */
  private static getJwtFromWsContext(context: ExecutionContext): string | undefined {
    const client = context.switchToWs().getClient();
    const token = client.handshake?.auth?.token;

    return token || undefined;
  }

  /**
   * The key under which the current authorization token is stored in the execution context.
   */
  private static KEY = 'current_auth_token';

  /**
   * Returns an authorization token stored in the current execution context. If the context has no
   * stored token, returns `undefined`.
   *
   * @param context
   * The current execution context.
   *
   * @returns
   * A token or `undefined`.
   */
  public static getFromContext(context: ExecutionContext): AuthTokenDto | undefined {
    return ExecutionContextHelper.getMeta<AuthTokenDto>(context, this.KEY);
  }

  /**
   * Puts the given authorization token into the current execution context.
   *
   * @param context
   * The current execution context.
   *
   * @param token
   * The token to be stored.
   */
  public static putToContext(context: ExecutionContext, token: AuthTokenDto): void {
    ExecutionContextHelper.setMeta(context, this.KEY, token);
  }
}
