import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { isMatching, match, P } from 'ts-pattern';

export type UpdateUserError = ServerError | ClientError;

export enum ServerError {
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  INCORRECT_DATA = 'INCORRECT_DATA',
}

export type ClientError = {
  type: 'INVALID_USER_DATA';
  message: string;
};

export namespace UpdateUserError {
  export function fromHttp(err: HttpErrorResponse): UpdateUserError | never {
    return match(err.status)
      .returnType<UpdateUserError>()
      .with(0, () => {
        throw new Error('You are offline or the server is down.');
      })
      .with(HttpStatusCode.Unauthorized, () => ServerError.UNAUTHORIZED)
      .with(HttpStatusCode.Forbidden, () => ServerError.FORBIDDEN)
      .with(HttpStatusCode.NotFound, () => ServerError.NOT_FOUND)
      .with(HttpStatusCode.Conflict, () => ServerError.CONFLICT)
      .with(HttpStatusCode.UnprocessableEntity, () =>
        getErrorFromUnprocessableEntity(err),
      )
      .otherwise(() => ServerError.UNKNOWN_ERROR);
  }
}

type UnprocessableEntityUserDetail = {
  loc: [string, number];
  msg: string;
  type: string;
};

type UnprocessableEntityUser = {
  detail: UnprocessableEntityUserDetail[];
};

const UnprocessableEntityUserPattern: P.Pattern<UnprocessableEntityUser> = {};

function getErrorFromUnprocessableEntity(
  err: HttpErrorResponse,
): UpdateUserError {
  const errorResponse: UnprocessableEntityUser = err.error;
  if (isMatching(UnprocessableEntityUserPattern, errorResponse))
    return { type: 'INVALID_USER_DATA', message: errorResponse.detail[0].msg };
  return ServerError.INCORRECT_DATA;
}
