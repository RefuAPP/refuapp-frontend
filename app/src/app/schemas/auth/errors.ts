import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { match } from 'ts-pattern';

export type AuthenticationErrors = ServerErrors | UserErrors;

export enum ServerErrors {
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  INCORRECT_DATA_FORMAT = 'INCORRECT_DATA_FORMAT',
}

export enum UserErrors {
  INCORRECT_PASSWORD = 'INCORRECT_PASSWORD',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  NOT_CONNECTED = 'NOT_CONNECTED',
}

export namespace AuthenticationErrors {
  export function fromHttp(
    err: HttpErrorResponse,
  ): AuthenticationErrors | never {
    return match(err.status)
      .returnType<AuthenticationErrors>()
      .with(0, () => {
        throw new Error('You are offline or the server is down.');
      })
      .with(HttpStatusCode.Unauthorized, () => UserErrors.INCORRECT_PASSWORD)
      .with(HttpStatusCode.NotFound, () => UserErrors.USER_NOT_FOUND)
      .with(
        HttpStatusCode.UnprocessableEntity,
        () => ServerErrors.INCORRECT_DATA_FORMAT,
      )
      .otherwise(() => ServerErrors.UNKNOWN_ERROR);
  }
}
