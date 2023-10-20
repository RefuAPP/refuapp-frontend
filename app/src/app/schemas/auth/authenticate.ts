import { AuthenticationErrors, ServerErrors } from './errors';
import { isMatching } from 'ts-pattern';
import { Token, TokenPattern } from './token';
import { HttpErrorResponse } from '@angular/common/http';

export type AuthenticationResponse =
  | {
      status: 'authenticated';
      data: Token;
    }
  | {
      status: 'error';
      error: AuthenticationErrors;
    };

export function fromResponse(response: any): AuthenticationResponse {
  if (isMatching(TokenPattern, response))
    return { status: 'authenticated', data: response };
  return {
    status: 'error',
    error: ServerErrors.INCORRECT_DATA_FORMAT,
  };
}

export function fromError(error: HttpErrorResponse): AuthenticationResponse {
  return {
    status: 'error',
    error: AuthenticationErrors.fromHttp(error),
  };
}
