import { match, P } from 'ts-pattern';
import { HttpErrorResponse } from '@angular/common/http';

export type LoginErrorsExtended =
  | {
      type: 'other';
      error: LoginErrors;
    }
  | {
      type: '422';
      message: string;
    };

export enum LoginErrors {
  UNAUTHORIZED = 'UNAUTHORIZED',
  NOT_FOUND = 'NOT_FOUND',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  SERVER_INCORRECT_DATA_FORMAT_ERROR = 'SERVER_INCORRECT_DATA_FORMAT_ERROR',
}

export namespace LoginErrors {
  export function from(error: LoginErrors): LoginErrorsExtended {
    return { type: 'other', error };
  }

  export function fromHttp(
    err: HttpErrorResponse,
  ): LoginErrorsExtended | never {
    return match(err.status)
      .returnType<LoginErrorsExtended>()
      .with(0, () => {
        throw new Error('You are offline or the server is down.');
      })
      .with(401, () => LoginErrors.from(LoginErrors.UNAUTHORIZED))
      .with(404, () => LoginErrors.from(LoginErrors.NOT_FOUND))
      .with(422, () => {
        const error: string = err.error.detail[0].msg;
        return { type: '422', message: error };
      })
      .otherwise(() => LoginErrors.from(LoginErrors.UNKNOWN_ERROR));
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
      error: LoginErrorsExtended;
    };

export const CorrectLoginResponsePattern: P.Pattern<CorrectLoginResponse> = {};
