import { ServerSignupErrors, SignUpErrors } from './errors/signup-errors';
import { P } from 'ts-pattern';
import { isMatching } from 'ts-pattern/dist';
import { of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

export type ValidUserSignUpResponse = {
  id: string;
  username: string;
  phone_number: string;
  emergency_number: string;
};

const CorrectSignupResponsePattern: P.Pattern<ValidUserSignUpResponse> = {};

export type SignupResponse =
  | {
      status: 'correct';
      data: ValidUserSignUpResponse;
    }
  | {
      status: 'error';
      error: SignUpErrors;
    };

export function parseValidResponse(
  response: ValidUserSignUpResponse,
): SignupResponse {
  if (isMatching(CorrectSignupResponsePattern, response))
    return { status: 'correct', data: response };
  return {
    status: 'error',
    error: {
      type: 'server-error',
      error: ServerSignupErrors.SERVER_INCORRECT_DATA_FORMAT_ERROR,
    },
  };
}

export function parseErrorResponse(err: HttpErrorResponse) {
  return of({
    status: 'error',
    error: SignUpErrors.fromHttp(err),
  });
}
