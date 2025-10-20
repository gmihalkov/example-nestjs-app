import type { ExecutionContext } from '@nestjs/common';

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
  public static getAuthorization(context: ExecutionContext): string | undefined {
    const type = context.getType();

    switch (type) {
      case 'http': {
        const request = context.switchToHttp().getRequest();
        const headers = request.headers ?? {};

        return headers.authorization || headers.Authorization || undefined;
      }

      case 'ws': {
        const client = context.switchToWs().getClient();
        const string = client.handshake?.auth?.token;

        return string || undefined;
      }

      default: {
        throw new Error(`${type} is not supported`);
      }
    }
  }

  /**
   * Parses the passed "Authorization" string, and returns a JWT token. If the string doesn't
   * match the format, returns `undefined`.
   *
   * @param authorization
   * The "Authorization" string.
   *
   * @returns
   * A JWT or `undefined`.
   */
  public static parseAuthorization(authorization: string): string | undefined {
    const protocol = 'Bearer ';

    if (!authorization.startsWith(protocol)) {
      return undefined;
    }

    const token = authorization.substring(protocol.length);

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
    const type = context.getType();

    switch (type) {
      case 'http': {
        const request = context.switchToHttp().getRequest();
        const state = request.state ?? {};

        return state[this.KEY] ?? undefined;
      }

      case 'ws': {
        const client = context.switchToWs().getClient();
        const data = client.data ?? {};

        return data[this.KEY] ?? undefined;
      }

      default: {
        throw new Error(`${type} is not supported`);
      }
    }
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
    const type = context.getType();

    switch (type) {
      case 'http': {
        const request = context.switchToHttp().getRequest();
        const state = request.state ?? {};

        state[this.KEY] = token;
        request.state = state;

        break;
      }

      case 'ws': {
        const client = context.switchToWs().getClient();
        const data = client.data ?? {};

        data[this.KEY] = token;
        client.data = data;

        break;
      }

      default: {
        throw new Error(`${type} is not supported`);
      }
    }
  }
}
