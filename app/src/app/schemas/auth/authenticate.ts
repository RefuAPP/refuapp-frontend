import { AuthenticationErrors, DeviceErrors } from './errors';
import { isMatching } from 'ts-pattern';
import { Token, TokenPattern } from './token';
import { HttpErrorResponse } from '@angular/common/http';
import { ServerErrors } from '../errors/server';

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

export function clientError(): AuthenticationResponse {
  return {
    status: 'error',
    error: DeviceErrors.NOT_CONNECTED,
  };
}
