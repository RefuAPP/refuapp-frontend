import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { isMatching, match, P } from 'ts-pattern';
import { ServerErrors } from '../../errors/server';

export type CreateUserError = ServerErrors | RepeatedData;

export type RepeatedData =
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
      .otherwise(() => ServerErrors.UNKNOWN_ERROR);
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
  return ServerErrors.INCORRECT_DATA_FORMAT_OF_CLIENT;
}
