import { Reservation, ReservationPattern } from './reservation';
import { isMatching, match } from 'ts-pattern';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';

export enum GetReservationError {
  REFUGE_NOT_FOUND = 'REFUGE_NOT_FOUND',
  SERVER_ERROR = 'SERVER_DATA_ERROR',
  NOT_ALLOWED_RESERVATION_FOR_USER = 'NOT_ALLOWED_RESERVATION_FOR_USER',
  NOT_AUTHENTICATED = 'NOT_AUTHENTICATED',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export namespace GetReservationError {
  export function from(error: HttpErrorResponse): GetReservationError | never {
    return match(error.status)
      .with(0, () => {
        throw new Error('You are offline or the server is down.');
      })
      .with(
        HttpStatusCode.Unauthorized,
        () => GetReservationError.NOT_AUTHENTICATED,
      )
      .with(HttpStatusCode.NotFound, () => GetReservationError.REFUGE_NOT_FOUND)
      .with(
        HttpStatusCode.Forbidden,
        () => GetReservationError.NOT_ALLOWED_RESERVATION_FOR_USER,
      )
      .otherwise(() => GetReservationError.UNKNOWN_ERROR);
  }
}

export type CorrectGetReservation = {
  status: 'ok';
  reservation: Reservation;
};

export type ErrorGetReservation = {
  status: 'error';
  error: GetReservationError;
};

export type GetReservation = CorrectGetReservation | ErrorGetReservation;

export function fromResponse(response: any): GetReservation {
  if (isMatching(ReservationPattern, response))
    return { status: 'ok', reservation: response };
  return { status: 'error', error: GetReservationError.SERVER_ERROR };
}

export function fromError(error: HttpErrorResponse): GetReservation | never {
  return {
    status: 'error',
    error: GetReservationError.from(error),
  };
}
