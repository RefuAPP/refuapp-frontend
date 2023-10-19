import { isMatching, P } from 'ts-pattern/dist';
import { HttpErrorResponse } from '@angular/common/http';
import { ServerSignupErrors, SignUpErrors } from './signup-errors';

type UnprocessableEntitySignUpDetail = {
  loc: [string, number];
  msg: string;
  type: string;
};

type UnprocessableEntitySignUp = {
  detail: UnprocessableEntitySignUpDetail[];
};

const UnprocessableEntitySignUpPattern: P.Pattern<UnprocessableEntitySignUp> =
  {};

export function getErrorFromUnprocessableEntity(
  err: HttpErrorResponse,
): SignUpErrors {
  const errorResponse: UnprocessableEntitySignUp = err.error;
  if (isMatching(UnprocessableEntitySignUpPattern, errorResponse)) {
    return { type: 'invalid-user-data', message: errorResponse.detail[0].msg };
  }
  return {
    type: 'server-error',
    error: ServerSignupErrors.SERVER_INCORRECT_DATA_FORMAT_ERROR,
  };
}
