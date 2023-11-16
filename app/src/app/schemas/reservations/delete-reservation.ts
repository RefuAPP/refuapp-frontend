import { HttpErrorResponse } from '@angular/common/http';
import { isMatching } from 'ts-pattern';
import { ReservationPattern, ReservationWithId } from './reservation';
import { ServerErrors } from '../errors/server';
import { PermissionsErrors } from '../errors/permissions';
import { ResourceErrors } from '../errors/resource';
import { getErrorFrom } from '../errors/all-errors';

export type DeleteReservationError =
  | ResourceErrors
  | ServerErrors
  | PermissionsErrors;

export type CorrectDeleteReservation = {
  status: 'ok';
  reservation: ReservationWithId;
};

export type ErrorDeleteReservation = {
  status: 'error';
  error: DeleteReservationError;
};

export type DeleteReservation =
  | CorrectDeleteReservation
  | ErrorDeleteReservation;

export function fromResponse(response: any): DeleteReservation {
  if (isMatching(ReservationPattern, response))
    return { status: 'ok', reservation: response };
  return {
    status: 'error',
    error: ServerErrors.INCORRECT_DATA_FORMAT_OF_SERVER,
  };
}

export function fromError(error: HttpErrorResponse): DeleteReservation | never {
  return {
    status: 'error',
    error: getErrorFrom(error),
  };
}
