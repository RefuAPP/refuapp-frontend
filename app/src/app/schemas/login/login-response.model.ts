import { match, P } from 'ts-pattern';
import { HttpErrorResponse } from '@angular/common/http';

export enum LoginErrors {
  UNAUTHORIZED = 'UNAUTHORIZED',
  NOT_FOUND = 'NOT_FOUND',
  CLIENT_SEND_DATA_ERROR = 'CLIENT_SEND_DATA_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  SERVER_INCORRECT_DATA_FORMAT_ERROR = 'SERVER_INCORRECT_DATA_FORMAT_ERROR',
}

export namespace LoginErrors {
  export function from(err: HttpErrorResponse): LoginErrors | never {
    return match(err.status)
      .returnType<LoginErrors>()
      .with(0, () => {
        throw new Error('You are offline or the server is down.');
      })
      .with(401, () => LoginErrors.UNAUTHORIZED)
      .with(404, () => LoginErrors.NOT_FOUND)
      .with(422, () => LoginErrors.CLIENT_SEND_DATA_ERROR)
      .otherwise(() => LoginErrors.UNKNOWN_ERROR);
  }
}

export interface CorrectLoginResponse {
  access_token: string;
  token_type: string;
}

export type LoginResponse =
  | {
      status: 'correct';
      data: CorrectLoginResponse;
    }
  | {
      status: 'error';
      error: LoginErrors;
    };

export const CorrectLoginResponsePattern: P.Pattern<CorrectLoginResponse> = {};
