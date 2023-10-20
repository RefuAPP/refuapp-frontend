import { of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ServerSignupErrors, SignUpError } from './sign-up-error';
import { isMatching, P } from 'ts-pattern';

export type SignUpData = {
  id: string;
  username: string;
  phone_number: string;
  emergency_number: string;
};

const CorrectSignupResponsePattern: P.Pattern<SignUpData> = {};

export type SignUpResponse =
  | {
      status: 'correct';
      data: SignUpData;
    }
  | {
      status: 'error';
      error: SignUpError;
    };

export function parseValidResponse(response: SignUpData): SignUpResponse {
  if (isMatching(CorrectSignupResponsePattern, response))
    return { status: 'correct', data: response };
  return {
    status: 'error',
    error: ServerSignupErrors.SERVER_INCORRECT_DATA_FORMAT_ERROR,
  };
}

export function parseErrorResponse(err: HttpErrorResponse) {
  return of({
    status: 'error',
    error: SignUpError.fromHttp(err),
  });
}
