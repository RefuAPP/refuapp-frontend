import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { match } from 'ts-pattern';
import { ServerErrors } from '../errors/server';
import { getErrorFrom } from '../errors/all-errors';

export type AuthenticationErrors = ServerErrors | UserFormErrors;

export enum UserFormErrors {
  INCORRECT_PASSWORD = 'LOGIN.PASSWORD.ERROR_INCORRECT_PASSWORD',
  USER_NOT_FOUND = 'LOGIN.USERNAME.ERROR_DOESNT_EXIST',
}

export namespace AuthenticationErrors {
  export function fromHttp(
    err: HttpErrorResponse,
  ): AuthenticationErrors | never {
    return match(err.status)
      .returnType<AuthenticationErrors>()
      .with(
        HttpStatusCode.Unauthorized,
        () => UserFormErrors.INCORRECT_PASSWORD,
      )
      .with(HttpStatusCode.NotFound, () => UserFormErrors.USER_NOT_FOUND)
      .otherwise(() => getErrorFrom(err) as ServerErrors);
  }
}
