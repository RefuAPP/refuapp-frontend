import { UserUpdated, UserUpdatedPattern } from '../user';
import { ServerError, UpdateUserError } from './update-user-error';
import { isMatching } from 'ts-pattern';
import { HttpErrorResponse } from '@angular/common/http';

export type UpdateUserResponse =
  | {
      status: 'updated';
      data: UserUpdated;
    }
  | {
      status: 'error';
      error: UpdateUserError;
    };

export function updateUserResponseFromResponse(
  response: any,
): UpdateUserResponse {
  if (isMatching(UserUpdatedPattern, response))
    return { status: 'updated', data: response };
  return {
    status: 'error',
    error: ServerError.INCORRECT_DATA,
  };
}

export function updateUserResponseFromError(
  err: HttpErrorResponse,
): UpdateUserResponse {
  return {
    status: 'error',
    error: UpdateUserError.fromHttp(err),
  };
}
