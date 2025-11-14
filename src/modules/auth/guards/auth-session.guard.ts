import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  mixin,
  type Type,
} from '@nestjs/common';

import type { AuthTokenDto } from '../dtos/auth-token.dto';
import { AuthSessionHelper } from '../helpers/auth-session.helper';
import type { AuthSessionModel } from '../models/auth-session.model';

/**
 * Describes options to configure the guard.
 */
type Options = {
  /**
   * Indicates should we throw `Unauthorized` exception if the auth session doesn't exist or invalid
   * or not.
   *
   * @default true
   */
  required?: boolean;
};

/**
 * Creates a guard that:
 *
 * - Gets an `Authorization` header from the current execution context;
 * - Parses the authorization token and validates it;
 * - Finds the corresponding `AuthSession` model in the database;
 * - And stores it in the current execution context.
 *
 * @param options
 * The options to configure the guard.
 *
 * @returns
 * A guard.
 */
export const AuthSessionGuard = (options: Options = {}): Type<CanActivate> => {
  const { required = true } = options;

  @Injectable()
  class AuthSessionMixin implements CanActivate {
    /**
     * @inheritdoc
     */
    public async canActivate(context: ExecutionContext): Promise<boolean> {
      const currentTime = this.getCurrentTime(context);

      const authorization = this.getAuthorization(context);

      if (!authorization) {
        return !required;
      }

      const userAgent = this.getUserAgent(context);

      if (!userAgent) {
        return !required;
      }

      const jwt = this.parseAuthorization(authorization);

      if (!jwt) {
        return !required;
      }

      const token = this.parseJwt(jwt);

      if (!token) {
        return !required;
      }

      const session = await this.findSession(token, currentTime);

      if (!session) {
        return !required;
      }

      if (session.accessTokenId !== token.jti) {
        return !required;
      }

      const device = this.getDevice(userAgent);

      if (session.device !== device) {
        return !required;
      }

      this.saveSession(context, session);

      return true;
    }

    /**
     * Returns a time when the current request came to the system.
     *
     * @param context
     * The execution context.
     *
     * @returns
     * A current time.
     */
    private getCurrentTime(context: ExecutionContext): Date {
      // TODO: Replace with the time when the request came to the system.
      Boolean(context);

      return new Date();
    }

    /**
     * Extracts the `Authorization` string from the passed execution context.
     *
     * @param context
     * The execution context.
     *
     * @returns
     * An authorization string or `undefined` if `Authorization` is not set or empty in the passed
     * context.
     */
    private getAuthorization(context: ExecutionContext): string | undefined {
      // TODO: Implement.
      Boolean(context);

      return '';
    }

    /**
     * Parses the passed authorization string and returns an access token.
     *
     * @param authorization
     * The authorization string.
     *
     * @returns
     * A token or `undefined`, if the authorization string is invalid.
     */
    private parseAuthorization(authorization: string): string | undefined {
      // TODO: Implement.
      Boolean(authorization);

      return undefined;
    }

    /**
     * Parses the given JWT and returns its payload.
     *
     * @param jwt
     * The JWT to be parsed.
     *
     * @returns
     * A payload DTO or `undefined` if the JWT is invalid.
     */
    private parseJwt(jwt: string): AuthTokenDto | undefined {
      // TODO: Implement.
      Boolean(jwt);

      return undefined;
    }

    /**
     * Finds the active auth session model by the passed token.
     *
     * @param token
     * The token containing the session ID.
     *
     * @param currentTime
     * The current time to filter out the expired sessions.
     *
     * @returns
     * A session model or `undefined` if the model not found.
     */
    private async findSession(
      token: AuthTokenDto,
      currentTime: Date,
    ): Promise<AuthSessionModel | undefined> {
      // TODO: Implement.
      Boolean(token);
      Boolean(currentTime);

      return undefined;
    }

    /**
     * Extracts `User-Agent` from the current execution context.
     *
     * @param context
     * The execution context.
     *
     * @returns
     * An `User-Agent` or `undefined` if it's not set or empty.
     */
    private getUserAgent(context: ExecutionContext): string | undefined {
      // TODO: Implement.
      Boolean(context);

      return undefined;
    }

    /**
     * Generates a device fingerprint based on the given parameters.
     *
     * @param userAgent
     * The `User-Agent`.
     *
     * @returns
     * A device fingerprint.
     */
    private getDevice(userAgent: string): string {
      // TODO: Implement.
      Boolean(userAgent);

      return '';
    }

    /**
     * Saves the given auth session in the current execution context.
     *
     * @param context
     * The execution context.
     *
     * @param session
     * The auth session to be stored.
     */
    private async saveSession(context: ExecutionContext, session: AuthSessionModel): Promise<void> {
      AuthSessionHelper.putToContext(context, session);
    }
  }

  return mixin(AuthSessionMixin);
};
