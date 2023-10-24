import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { isMatching, match } from 'ts-pattern';
import { Reservation, Reservations, ReservationsPattern } from './reservation';
import { P } from 'ts-pattern/dist';
import { Observable } from 'rxjs';
import { GetReservation } from './get-reservation';

export enum ReservationRefugeAndUserError {
  USER_OR_REFUGE_NOT_FOUND = 'USER_OR_REFUGE_NOT_FOUND',
  NOT_ALLOWED_RESERVATION_FOR_USER = 'NOT_ALLOWED_RESERVATION_FOR_USER',
  SERVER_ERROR = 'SERVER_DATA_ERROR',
  NOT_AUTHENTICATED = 'NOT_AUTHENTICATED',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export namespace ReservationRefugeAndUserError {
  export function from(
    error: HttpErrorResponse,
  ): ReservationRefugeAndUserError | never {
    return match(error.status)
      .with(0, () => {
        throw new Error('You are offline or the server is down.');
      })
      .with(
        HttpStatusCode.Unauthorized,
        () => ReservationRefugeAndUserError.NOT_AUTHENTICATED,
      )
      .with(
        HttpStatusCode.NotFound,
        () => ReservationRefugeAndUserError.USER_OR_REFUGE_NOT_FOUND,
      )
      .with(
        HttpStatusCode.Forbidden,
        () => ReservationRefugeAndUserError.NOT_ALLOWED_RESERVATION_FOR_USER,
      )
      .otherwise(() => ReservationRefugeAndUserError.UNKNOWN_ERROR);
  }
}

export type CorrectRefugeAndUserReservation = {
  status: 'ok';
  reservations: Reservations;
};

export const CorrectRefugeAndUserReservationPattern: P.Pattern<CorrectRefugeAndUserReservation> =
  {};

export type ErrorRefugeAndUserReservation = {
  status: 'error';
  error: ReservationRefugeAndUserError;
};

export type GetReservationsRefugeAndUser =
  | CorrectRefugeAndUserReservation
  | ErrorRefugeAndUserReservation;

export function fromResponse(response: any): GetReservationsRefugeAndUser {
  if (isMatching(ReservationsPattern, response))
    return { status: 'ok', reservations: response };
  return { status: 'error', error: ReservationRefugeAndUserError.SERVER_ERROR };
}

export function fromError(
  error: HttpErrorResponse,
): GetReservationsRefugeAndUser | never {
  return {
    status: 'error',
    error: ReservationRefugeAndUserError.from(error),
  };
}

// What the observable returns

export type CorrectGetReservationsRefugeAndUser = {
  status: 'ok';
  reservation: Observable<GetReservation>[];
};

export type GetReservations =
  | CorrectGetReservationsRefugeAndUser
  | ReservationRefugeAndUserError;
