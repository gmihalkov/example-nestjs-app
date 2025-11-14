import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';

import { ApiController } from '@/common/swagger';

import { AuthSignUpByPasswordStartParamsDto as SignUpByPasswordStartParams } from '../dtos/auth-sign-up-by-password-start-params.dto';
import { AuthSignUpByPasswordStartResultDto as SignUpByPasswordStartResult } from '../dtos/auth-sign-up-by-password-start-result.dto';
import { AuthSignUpByPasswordVerifyParamsDto as SignUpByPasswordVerifyParams } from '../dtos/auth-sign-up-by-password-verify-params.dto';
import { AuthSignUpByPasswordVerifyResultDto as SignUpByPasswordVerifyResult } from '../dtos/auth-sign-up-by-password-verify-result.dto';
import { AuthRoute } from '../enums/auth-route.enum';

/**
 * The controller that serves the routes related with authentication and authorization.s
 */
@Controller(AuthRoute.INDEX)
@ApiController({
  title: '🔑 Authentication & Authorization',
  description: `
    <p>The group of activities related with the user authorization and authentication. It contains
    the endpoints to:</p>
    <ul>
      <li>Sign up;</li>
      <li>Sign in;</li>
      <li>Prolong the authorization token;</li>
      <li>Sign out.</li>
    </ul>
  `.trim(),
})
export class AuthController {
  /**
   * The endpoint that starts the signing-up process. It takes a username and a desired password,
   * and sends an email to the user with the verification code.
   */
  @Post(AuthRoute.SIGN_UP_BY_PASSWORD_START)
  @ApiOperation({
    summary: 'Start sign-up by password',
    description: `
      <p>This endpoint starts sign-up by password. It takes a username and desired password, and
      sends to the user the verification email.</p>
      <p>Next, the user must send us the token from the email back using the
      <code>${AuthRoute.SIGN_UP_BY_PASSWORD_VERIFY}</code> endpoint.</p>
    `.trim(),
  })
  @ApiBody({ type: SignUpByPasswordStartParams })
  @ApiCreatedResponse({ type: SignUpByPasswordStartResult })
  public async signUpByPasswordStart(
    @Body() params: SignUpByPasswordStartParams,
  ): Promise<SignUpByPasswordStartResult> {
    Boolean(params);
    throw new Error('Not implemented');
  }

  /**
   * The endpoint that verify and completes the signing-up process. It takes the verification code
   * that we sent to the user, and returns an authorization token.
   */
  @Post(AuthRoute.SIGN_UP_BY_PASSWORD_VERIFY)
  @ApiOperation({
    summary: 'Verify and complete sign-up by password',
    description: `
      <p>This endpoint verifies and completes sign-up by password. It takes a verification code
      that we sent to the user, and returns an authorization token.</p>
    `.trim(),
  })
  @ApiBody({ type: SignUpByPasswordVerifyParams })
  @ApiCreatedResponse({ type: SignUpByPasswordVerifyResult })
  public async signUpByPasswordVerify(
    @Body() params: SignUpByPasswordVerifyParams,
  ): Promise<SignUpByPasswordVerifyResult> {
    Boolean(params);
    throw new Error('Not implemented');
  }
}
