import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { isMatching, match, P } from 'ts-pattern';

export type SignUpError = ServerSignupErrors | ClientSignupError;

export enum ServerSignupErrors {
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  SERVER_INCORRECT_DATA_FORMAT_ERROR = 'SERVER_INCORRECT_DATA_FORMAT_ERROR',
}

export type ClientSignupError =
  | 'PHONE_ALREADY_EXISTS'
  | {
      type: 'invalid-user-data';
      message: string;
    };

export namespace SignUpError {
  export function fromHttp(err: HttpErrorResponse): SignUpError | never {
    return match(err.status)
      .returnType<SignUpError>()
      .with(0, () => {
        throw new Error('You are offline or the server is down.');
      })
      .with(HttpStatusCode.Conflict, () => 'PHONE_ALREADY_EXISTS')
      .with(HttpStatusCode.UnprocessableEntity, () =>
        getErrorFromUnprocessableEntity(err),
      )
      .otherwise(() => ServerSignupErrors.UNKNOWN_ERROR);
  }
}

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

function getErrorFromUnprocessableEntity(err: HttpErrorResponse): SignUpError {
  const errorResponse: UnprocessableEntitySignUp = err.error;
  if (isMatching(UnprocessableEntitySignUpPattern, errorResponse))
    return { type: 'invalid-user-data', message: errorResponse.detail[0].msg };
  return ServerSignupErrors.SERVER_INCORRECT_DATA_FORMAT_ERROR;
}
