import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { match } from 'ts-pattern';

export enum GenerateDataError {
  NOT_FOUND = 'NOT_FOUND',
  INCORRECT_DATA = 'INCORRECT_DATA',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export namespace GenerateDataError {
  export function fromHttp(err: HttpErrorResponse): GenerateDataError | never {
    return match(err.status)
      .returnType<GenerateDataError>()
      .with(0, () => {
        throw new Error('You are offline or the server is down.');
      })
      .with(HttpStatusCode.NotFound, () => GenerateDataError.NOT_FOUND)
      .with(
        HttpStatusCode.UnprocessableEntity,
        () => GenerateDataError.INCORRECT_DATA,
      )
      .otherwise(() => GenerateDataError.UNKNOWN_ERROR);
  }
}
