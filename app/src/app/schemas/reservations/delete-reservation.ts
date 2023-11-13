import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { isMatching, match } from 'ts-pattern';
import {
  Reservation,
  ReservationPattern,
  ReservationWithId,
} from './reservation';

export enum DeleteReservationError {
  RESERVATION_NOT_FOUND = 'RESERVATION_NOT_FOUND',
  PROGRAMMING_ERROR = 'PROGRAMMING_ERROR',
  SERVER_ERROR = 'SERVER_DATA_ERROR',
  NOT_ALLOWED_DELETION_FOR_USER = 'NOT_ALLOWED_DELETION_FOR_USER',
  NOT_AUTHENTICATED = 'NOT_AUTHENTICATED',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export namespace DeleteReservationError {
  export function from(
    error: HttpErrorResponse,
  ): DeleteReservationError | never {
    return match(error.status)
      .with(0, () => {
        throw new Error('You are offline or the server is down.');
      })
      .with(
        HttpStatusCode.Unauthorized,
        () => DeleteReservationError.NOT_AUTHENTICATED,
      )
      .with(
        HttpStatusCode.NotFound,
        () => DeleteReservationError.RESERVATION_NOT_FOUND,
      )
      .with(
        HttpStatusCode.Forbidden,
        () => DeleteReservationError.NOT_ALLOWED_DELETION_FOR_USER,
      )
      .with(
        HttpStatusCode.UnprocessableEntity,
        () => DeleteReservationError.PROGRAMMING_ERROR,
      )
      .otherwise(() => DeleteReservationError.UNKNOWN_ERROR);
  }
}

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
  return { status: 'error', error: DeleteReservationError.SERVER_ERROR };
}

export function fromError(error: HttpErrorResponse): DeleteReservation | never {
  return {
    status: 'error',
    error: DeleteReservationError.from(error),
  };
}
