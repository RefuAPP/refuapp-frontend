import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { match } from 'ts-pattern';
import { ServerErrors } from '../errors/server';

export type NonUserFormErrors = ServerErrors;

export type AuthenticationErrors = NonUserFormErrors | UserFormErrors;

export enum UserFormErrors {
  INCORRECT_PASSWORD = 'INCORRECT_PASSWORD',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
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
      .with(
        HttpStatusCode.Unauthorized,
        () => UserFormErrors.INCORRECT_PASSWORD,
      )
      .with(HttpStatusCode.NotFound, () => UserFormErrors.USER_NOT_FOUND)
      .with(
        HttpStatusCode.UnprocessableEntity,
        () => ServerErrors.INCORRECT_DATA_FORMAT_OF_CLIENT,
      )
      .otherwise(() => ServerErrors.UNKNOWN_ERROR);
  }
}
