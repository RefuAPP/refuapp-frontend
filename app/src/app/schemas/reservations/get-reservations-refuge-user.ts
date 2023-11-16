import { HttpErrorResponse } from '@angular/common/http';
import { isMatching } from 'ts-pattern';
import { ReservationPattern, Reservations } from './reservation';
import { P } from 'ts-pattern/dist';
import { ResourceErrors } from '../errors/resource';
import { ServerErrors } from '../errors/server';
import { PermissionsErrors } from '../errors/permissions';
import { getErrorFrom } from '../errors/all-errors';

export type CorrectGetReservations = {
  status: 'ok';
  reservations: Reservations;
};

export const CorrectGetReservationsPattern: P.Pattern<CorrectGetReservations> =
  {};

export type ErrorGetReservations = {
  status: 'error';
  error: ResourceErrors | ServerErrors | PermissionsErrors;
};

export const ErrorGetReservationsPattern: P.Pattern<ErrorGetReservations> = {};

export type GetReservations = CorrectGetReservations | ErrorGetReservations;

export function fromResponse(response: any): GetReservations {
  if (
    Array.isArray(response) &&
    response.every((reservation) => isMatching(ReservationPattern, reservation))
  )
    return { status: 'ok', reservations: response };
  return {
    status: 'error',
    error: ServerErrors.INCORRECT_DATA_FORMAT_OF_SERVER,
  };
}

export function fromError(error: HttpErrorResponse): GetReservations | never {
  return {
    status: 'error',
    error: getErrorFrom(error),
  };
}
