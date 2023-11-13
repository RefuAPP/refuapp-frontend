import { User } from '../user';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { match } from 'ts-pattern';

export enum GetUserFromIdErrors {
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CLIENT_SEND_DATA_ERROR = 'CLIENT_SEND_DATA_ERROR',
  PROGRAMMER_SEND_DATA_ERROR = 'PROGRAMMER_SEND_DATA_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  SERVER_INCORRECT_DATA_FORMAT_ERROR = 'SERVER_INCORRECT_DATA_FORMAT_ERROR',
}

export type GetUserResponse =
  | {
      status: 'correct';
      data: User;
    }
  | {
      status: 'error';
      error: GetUserFromIdErrors;
    };

export namespace GetUserFromIdErrors {
  export function from(err: HttpErrorResponse): GetUserFromIdErrors | never {
    return match(err.status)
      .returnType<GetUserFromIdErrors>()
      .with(0, () => {
        throw new Error('You are offline or the server is down.');
      })
      .with(HttpStatusCode.Unauthorized, () => GetUserFromIdErrors.UNAUTHORIZED)
      .with(HttpStatusCode.Forbidden, () => GetUserFromIdErrors.FORBIDDEN)
      .with(HttpStatusCode.NotFound, () => GetUserFromIdErrors.NOT_FOUND)
      .with(
        HttpStatusCode.UnprocessableEntity,
        () => GetUserFromIdErrors.PROGRAMMER_SEND_DATA_ERROR,
      )
      .otherwise(() => GetUserFromIdErrors.UNKNOWN_ERROR);
  }
}
