import {HttpErrorResponse} from '@angular/common/http';
import {isMatching} from 'ts-pattern';
import {WeekReservations, ReservationsWeekPattern} from './reservation';
import {P} from 'ts-pattern/dist';
import {ResourceErrors} from '../errors/resource';
import {ServerErrors} from '../errors/server';
import {PermissionsErrors} from '../errors/permissions';
import {getErrorFrom} from '../errors/all-errors';

export type CorrectGetWeekReservations = {
  status: 'ok';
  week: WeekReservations;
};

export const CorrectGetWeekReservationsPattern: P.Pattern<CorrectGetWeekReservations> =
  {};

export type ErrorGetReservations = {
  status: 'error';
  error: ResourceErrors | ServerErrors | PermissionsErrors;
};

export const ErrorGetReservationsPattern: P.Pattern<ErrorGetReservations> = {};

export type GetWeekReservations = CorrectGetWeekReservations | ErrorGetReservations;

export function fromResponse(response: any): GetWeekReservations {
  if (
    Array.isArray(response) &&
    response.every((reservation) => isMatching(ReservationsWeekPattern, reservation))
  )
    return {status: 'ok', week: response};
  return {
    status: 'error',
    error: ServerErrors.INCORRECT_DATA_FORMAT_OF_SERVER,
  };
}

export function fromError(error: HttpErrorResponse): GetWeekReservations | never {
  return {
    status: 'error',
    error: getErrorFrom(error),
  };
}
