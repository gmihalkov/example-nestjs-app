/**
 * The enum that contains the authentication and authorization route paths.
 */
export enum AuthRoute {
  /**
   * The index route path.
   */
  INDEX = '/auth',

  /**
   * The route that starts the signing up by password process.
   */
  SIGN_UP_BY_PASSWORD_START = '/sign-up-by-password',

  /**
   * The route that verifies and completes the signing up by password process.
   */
  SIGN_UP_BY_PASSWORD_VERIFY = '/sign-up-by-password/verify',
}
