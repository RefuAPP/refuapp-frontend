import { HttpErrorResponse } from '@angular/common/http';
import { CreateUserError } from './create-user-error';
import { isMatching } from 'ts-pattern';
import { UserCreated, UserCreatedPattern } from '../user';
import { ServerErrors } from '../../errors/server';

export type CreateUserResponse =
  | {
      status: 'created';
      data: UserCreated;
    }
  | {
      status: 'error';
      error: CreateUserError;
    };

export function fromResponse(response: any): CreateUserResponse {
  if (isMatching(UserCreatedPattern, response))
    return { status: 'created', data: response };
  return {
    status: 'error',
    error: ServerErrors.INCORRECT_DATA_FORMAT,
  };
}

export function fromError(err: HttpErrorResponse): CreateUserResponse {
  return {
    status: 'error',
    error: CreateUserError.fromHttp(err),
  };
}
