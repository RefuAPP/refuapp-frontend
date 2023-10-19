import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { match } from 'ts-pattern';
import { getErrorFromUnprocessableEntity } from './unprocessable-entity';

export enum ServerSignupErrors {
  CONFLICT = 'CONFLICT',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  SERVER_INCORRECT_DATA_FORMAT_ERROR = 'SERVER_INCORRECT_DATA_FORMAT_ERROR',
}

export type SignUpErrors =
  | {
      type: 'server-error';
      error: ServerSignupErrors;
    }
  | {
      type: 'invalid-user-data';
      message: string;
    };

export namespace SignUpErrors {
  function from(error: ServerSignupErrors): SignUpErrors {
    return { type: 'server-error', error: error };
  }

  export function fromHttp(err: HttpErrorResponse): SignUpErrors | never {
    return match(err.status)
      .returnType<SignUpErrors>()
      .with(0, () => {
        throw new Error('You are offline or the server is down.');
      })
      .with(HttpStatusCode.Conflict, () => from(ServerSignupErrors.CONFLICT))
      .with(HttpStatusCode.UnprocessableEntity, () =>
        getErrorFromUnprocessableEntity(err),
      )
      .otherwise(() => from(ServerSignupErrors.UNKNOWN_ERROR));
  }
}
