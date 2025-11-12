import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ApiCreatedResponse, ApiNoContentResponse, ApiOperation } from '@nestjs/swagger';

import { OneOfPipe } from '@/common/nestjs';
import { ApiBodyOneOf, ApiController } from '@/common/swagger';

import { AuthSignUpByPasswordCompleteParamsDto as SignUpVerificationParams } from '../dtos/auth-sign-up-by-password-complete-params.dto';
import { AuthSignUpByPasswordResultDto as SignUpByPasswordResult } from '../dtos/auth-sign-up-by-password-result.dto';
import { AuthSignUpByPasswordStartParamsDto as SignUpByPasswordStartParams } from '../dtos/auth-sign-up-by-password-start-params.dto';
import { AuthRoute } from '../enums/auth-route.enum';

/**
 * The controller that serves the routes related with authentication and authorization.s
 */
@Controller(AuthRoute.INDEX)
@ApiController({
  title: '🔑 Authentication & Authorization',
  description: `
    <p>The group of activities related with the user authorization and authentication.</p>
  `.trim(),
})
export class AuthController {
  /**
   * The method that is responsible for signing up the new users.
   */
  @ApiOperation({
    summary: 'Sign up by password',
    description: `
      <p>This endpoint signs up the new user by provided email and password. The process consists of
      two requests:</p>
      <ul>
        <li>The client must send us a username (i.e., email) and the desired password. After
        this, we send him a verification code.</li>
        <li>Next, the client must send us that verification code back.</li>
      </ul>
      <p>The endpoint serves the both requests. To initialize the process, you need to send an
      object containing the email and the password. To complete signing up, you need to pass the
      same email and the verification code sent to that email.</p>
    `.trim(),
  })
  @ApiBodyOneOf({
    types: [SignUpByPasswordStartParams, SignUpVerificationParams],
  })
  @ApiNoContentResponse({
    description: 'Once the email and password were provided, it returns No Content.',
  })
  @ApiCreatedResponse({
    type: SignUpByPasswordResult,
    description:
      'Once the email and verification code were provided, it returns an object containing the authorization token.',
  })
  @Post(AuthRoute.SIGN_UP_BY_PASSWORD)
  @UsePipes(new OneOfPipe([SignUpByPasswordStartParams, SignUpVerificationParams]))
  public async signUpByPassword(
    @Body() params: SignUpByPasswordStartParams | SignUpVerificationParams,
  ): Promise<void> {
    // TODO: Implement.
    Boolean(params);
  }
}
