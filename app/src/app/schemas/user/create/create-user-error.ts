import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { isMatching, match, P } from 'ts-pattern';

export type CreateUserError = ServerError | ClientError;

export enum ServerError {
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  INCORRECT_DATA = 'INCORRECT_DATA',
}

export type ClientError =
  | 'PHONE_ALREADY_EXISTS'
  | {
      type: 'INVALID_USER_DATA';
      message: string;
    };

export namespace CreateUserError {
  export function fromHttp(err: HttpErrorResponse): CreateUserError | never {
    return match(err.status)
      .returnType<CreateUserError>()
      .with(0, () => {
        throw new Error('You are offline or the server is down.');
      })
      .with(HttpStatusCode.Conflict, () => 'PHONE_ALREADY_EXISTS')
      .with(HttpStatusCode.UnprocessableEntity, () =>
        getErrorFromUnprocessableEntity(err),
      )
      .otherwise(() => ServerError.UNKNOWN_ERROR);
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

function getErrorFromUnprocessableEntity(
  err: HttpErrorResponse,
): CreateUserError {
  const errorResponse: UnprocessableEntitySignUp = err.error;
  if (isMatching(UnprocessableEntitySignUpPattern, errorResponse))
    return { type: 'INVALID_USER_DATA', message: errorResponse.detail[0].msg };
  return ServerError.INCORRECT_DATA;
}
