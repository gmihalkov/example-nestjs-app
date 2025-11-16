import { Expose, plainToInstance } from 'class-transformer';
import { IsInt, IsPositive, validateSync } from 'class-validator';
import { verify } from 'jsonwebtoken';

/**
 * The DTO class that describes an authorization JWT payload.
 */
export class AuthTokenDto {
  /**
   * The JWT's subject. Usually, it is an auth session's ID.
   */
  @Expose()
  @IsInt()
  @IsPositive()
  public sub!: number;

  /**
   * The token ID.
   */
  @Expose()
  @IsInt()
  @IsPositive()
  public jti!: number;

  /**
   * Decodes the given JWT and returns its payload as a DTO instance. If the passed value is not
   * JWT, or its payload doesn't match the DTO class, returns `undefined`.
   *
   * @param jwt
   * The JWT to be decoded.
   *
   * @param signature
   * The signature string to verify the token.
   *
   * @returns
   * A DTO instance or `undefined`.
   */
  public static decode(jwt: string, signature: string): AuthTokenDto | undefined {
    const payload = verify(jwt, signature);

    if (typeof payload !== 'object' || payload === null) {
      return undefined;
    }

    const instance = plainToInstance(this, payload, { excludeExtraneousValues: true });
    const issues = validateSync(instance);

    if (issues.length > 0) {
      return undefined;
    }

    return instance;
  }
}
