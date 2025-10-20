import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { verify } from 'jsonwebtoken';

/**
 * The DTO that describes an authorization token payload.
 */
export class AuthTokenDto {
  /**
   * The user ID.
   */
  public readonly sub!: number;

  /**
   * The time when the token will expire (UNIX-timestamp).
   */
  public readonly exp!: number;

  /**
   * Tries to parse the given string as JWT using the provided signature. If the passed string is
   * not JWT, or its payload didn't pass the validation, returns `undefined`.
   *
   * @param token
   * The JWT to be parsed.
   *
   * @param signature
   * The token signature.
   *
   * @returns
   * A token DTO.
   */
  public static decode(token: string, signature: string): AuthTokenDto | undefined {
    let payload: unknown;

    try {
      payload = verify(token, signature);
    } catch (_) {
      return undefined;
    }

    if (typeof payload !== 'object') {
      return undefined;
    }

    const dto = plainToInstance(this, payload, { excludeExtraneousValues: true });
    const issue = validateSync(dto, { stopAtFirstError: true }).at(0);

    if (issue) {
      return undefined;
    }

    return dto;
  }
}
