import {
  type CanActivate,
  type ExecutionContext,
  Inject,
  Injectable,
  type Type as Mixin,
  mixin,
} from '@nestjs/common';

import { AuthConfig } from '../auth.config';
import { AuthTokenDto } from '../dto/auth-token.dto';
import { CurrentAuthTokenHelper } from '../helpers/current-auth-token.helper';

/**
 * Describes the guard options.
 */
type Options = {
  /**
   * Indicates if the request without authorized token must be declined.
   *
   * @default true
   */
  required?: boolean;
};

/**
 * Returns a guard that checks if the incoming request has an authorization token, parses it, and
 * puts into the execution context. It could allow or denied the request based on the
 * `options.required` flag. By default, all requests without an authorization token will be
 * declined.
 *
 * @param options
 * The guard options.
 *
 * @returns
 * A guard.
 */
export const CurrentAuthTokenGuard = (options: Options = {}): Mixin<CanActivate> => {
  const { required = true } = options;

  /**
   * The current authorization token guard.
   */
  @Injectable()
  class WithCurrentAuthToken implements CanActivate {
    /**
     * The module configuration.
     */
    @Inject(AuthConfig)
    private readonly config!: AuthConfig;

    /**
     * @inheritdoc
     */
    public async canActivate(context: ExecutionContext): Promise<boolean> {
      const existingDto = CurrentAuthTokenHelper.getFromContext(context);

      if (existingDto) {
        return true;
      }

      const authorization = CurrentAuthTokenHelper.getAuthorization(context);

      if (!authorization) {
        return !required;
      }

      const jwt = CurrentAuthTokenHelper.parseAuthorization(authorization);

      if (!jwt) {
        return !required;
      }

      const dto = AuthTokenDto.decode(jwt, this.config.tokenSignature);

      if (!dto) {
        return !required;
      }

      CurrentAuthTokenHelper.putToContext(context, dto);

      return true;
    }
  }

  return mixin(WithCurrentAuthToken);
};
