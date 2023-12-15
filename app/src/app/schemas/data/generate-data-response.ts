import { GenerateDataError } from './generate-data-error';
import { isMatching, P } from 'ts-pattern';
import { HttpErrorResponse } from '@angular/common/http';

export type GenerateDataCsvResponse =
  | {
      status: 'generated';
      data: string;
    }
  | {
      status: 'error';
      error: GenerateDataError;
    };

export function generateDataCsvResponseFromResponse(
  response: any,
): GenerateDataCsvResponse {
  if (isMatching(P.string, response))
    return { status: 'generated', data: response };
  return {
    status: 'error',
    error: GenerateDataError.INCORRECT_DATA,
  };
}

export function generateDataCsvResponseFromError(
  err: HttpErrorResponse,
): GenerateDataCsvResponse {
  return {
    status: 'error',
    error: GenerateDataError.fromHttp(err),
  };
}
