import { applyDecorators, Inject } from '@nestjs/common';

import { MAILER } from '../tokens/mailer.token';

/**
 * The decorator that injects a mailer transport.
 *
 * @returns
 * A decorator.
 */
export const InjectMailer = () => applyDecorators(Inject(MAILER));
