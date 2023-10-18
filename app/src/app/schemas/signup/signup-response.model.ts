import { HttpErrorResponse } from '@angular/common/http';
import { match, P } from 'ts-pattern';

export enum SignUpErrors {
  UNAUTHORIZED = 'UNAUTHORIZED',
  CONFLICT = 'CONFLICT',
  CLIENT_SEND_DATA_ERROR = 'CLIENT_SEND_DATA_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  SERVER_INCORRECT_DATA_FORMAT_ERROR = 'SERVER_INCORRECT_DATA_FORMAT_ERROR',
}

export namespace SignUpErrors {
  export function from(err: HttpErrorResponse): SignUpErrors | never {
    return match(err.status)
      .returnType<SignUpErrors>()
      .with(0, () => {
        throw new Error('You are offline or the server is down.');
      })
      .with(401, () => SignUpErrors.UNAUTHORIZED)
      .with(409, () => SignUpErrors.CONFLICT)
      .with(422, () => SignUpErrors.CLIENT_SEND_DATA_ERROR)
      .otherwise(() => SignUpErrors.UNKNOWN_ERROR);
  }
}

export interface CorrectSignupResponse {
  username: string;
  phone_number: string;
  emergency_number: string;
  id: string;
}

export type SignupResponse =
  | {
      status: 'correct';
      data: CorrectSignupResponse;
    }
  | {
      status: 'error';
      error: SignUpErrors;
    };

export const CorrectSignupResponsePattern: P.Pattern<CorrectSignupResponse> =
  {};
