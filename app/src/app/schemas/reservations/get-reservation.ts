import { Reservation, ReservationPattern } from './reservation';
import { isMatching } from 'ts-pattern';
import { HttpErrorResponse } from '@angular/common/http';
import { ServerErrors } from '../errors/server';
import { PermissionsErrors } from '../errors/permissions';
import { ResourceErrors } from '../errors/resource';
import { getErrorFrom } from '../errors/all-errors';

export type CorrectGetReservation = {
  status: 'ok';
  reservation: Reservation;
};

export type ErrorGetReservation = {
  status: 'error';
  error: ResourceErrors | ServerErrors | PermissionsErrors;
};

export type GetReservation = CorrectGetReservation | ErrorGetReservation;

export function fromResponse(response: any): GetReservation {
  if (isMatching(ReservationPattern, response))
    return { status: 'ok', reservation: response };
  return {
    status: 'error',
    error: ServerErrors.INCORRECT_DATA_FORMAT_OF_SERVER,
  };
}

export function fromError(error: HttpErrorResponse): GetReservation | never {
  return {
    status: 'error',
    error: getErrorFrom(error),
  };
}
