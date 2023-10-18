import { HttpErrorResponse } from '@angular/common/http';
import { match, P } from 'ts-pattern';

export type SignUpErrorsExtended =
  | {
      type: 'other';
      error: SignUpErrors;
    }
  | {
      type: '422';
      message: string;
    };
export enum SignUpErrors {
  UNAUTHORIZED = 'UNAUTHORIZED',
  CONFLICT = 'CONFLICT',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  SERVER_INCORRECT_DATA_FORMAT_ERROR = 'SERVER_INCORRECT_DATA_FORMAT_ERROR',
}

export namespace SignUpErrors {
  export function from(error: SignUpErrors): SignUpErrorsExtended {
    return { type: 'other', error };
  }

  export function fromHttp(
    err: HttpErrorResponse,
  ): SignUpErrorsExtended | never {
    return match(err.status)
      .returnType<SignUpErrorsExtended>()
      .with(0, () => {
        throw new Error('You are offline or the server is down.');
      })
      .with(401, () => SignUpErrors.from(SignUpErrors.UNAUTHORIZED))
      .with(409, () => SignUpErrors.from(SignUpErrors.CONFLICT))
      .with(422, () => {
        const error: string = err.error.detail[0].msg;
        return { type: '422', message: error };
      })
      .otherwise(() => SignUpErrors.from(SignUpErrors.UNKNOWN_ERROR));
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
      error: SignUpErrorsExtended;
    };

export const CorrectSignupResponsePattern: P.Pattern<CorrectSignupResponse> =
  {};
