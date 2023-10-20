import { of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ServerError, CreateUserError } from './create-user-error';
import { isMatching, P } from 'ts-pattern';
import { UserCreated, UserCreatedPattern } from '../user';

export type CreateUserResponse =
  | {
      status: 'created';
      data: UserCreated;
    }
  | {
      status: 'error';
      error: CreateUserError;
    };

export function parseValidResponse(response: UserCreated): CreateUserResponse {
  if (isMatching(UserCreatedPattern, response))
    return { status: 'created', data: response };
  return {
    status: 'error',
    error: ServerError.INCORRECT_DATA,
  };
}

export function parseErrorResponse(err: HttpErrorResponse) {
  return of({
    status: 'error',
    error: CreateUserError.fromHttp(err),
  });
}
