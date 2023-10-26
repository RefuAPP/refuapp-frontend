import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { isMatching, match } from 'ts-pattern';
import { ReservationPattern, Reservations } from './reservation';
import { P } from 'ts-pattern/dist';

export enum ReservationsError {
  USER_OR_REFUGE_NOT_FOUND = 'USER_OR_REFUGE_NOT_FOUND',
  NOT_ALLOWED_RESERVATION_FOR_USER = 'NOT_ALLOWED_RESERVATION_FOR_USER',
  SERVER_ERROR = 'SERVER_DATA_ERROR',
  NOT_AUTHENTICATED = 'NOT_AUTHENTICATED',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export namespace ReservationsError {
  export function from(error: HttpErrorResponse): ReservationsError | never {
    return match(error.status)
      .with(0, () => {
        throw new Error('You are offline or the server is down.');
      })
      .with(
        HttpStatusCode.Unauthorized,
        () => ReservationsError.NOT_AUTHENTICATED,
      )
      .with(
        HttpStatusCode.NotFound,
        () => ReservationsError.USER_OR_REFUGE_NOT_FOUND,
      )
      .with(
        HttpStatusCode.Forbidden,
        () => ReservationsError.NOT_ALLOWED_RESERVATION_FOR_USER,
      )
      .otherwise(() => ReservationsError.UNKNOWN_ERROR);
  }
}

export type CorrectGetReservations = {
  status: 'ok';
  reservations: Reservations;
};

export const CorrectGetReservationsPattern: P.Pattern<CorrectGetReservations> =
  {};

export type ErrorGetReservations = {
  status: 'error';
  error: ReservationsError;
};

export const ErrorGetReservationsPattern: P.Pattern<ErrorGetReservations> = {};

export type GetReservations = CorrectGetReservations | ErrorGetReservations;

export function fromResponse(response: any): GetReservations {
  if (
    Array.isArray(response) &&
    response.every((reservation) => isMatching(ReservationPattern, reservation))
  )
    return { status: 'ok', reservations: response };
  return { status: 'error', error: ReservationsError.SERVER_ERROR };
}

export function fromError(error: HttpErrorResponse): GetReservations | never {
  return {
    status: 'error',
    error: ReservationsError.from(error),
  };
}
