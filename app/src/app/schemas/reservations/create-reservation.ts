import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { isMatching, match } from 'ts-pattern';
import {
  Reservation,
  ReservationPattern,
  ReservationWithId,
} from './reservation';

export enum CreateReservationError {
  REFUGE_OR_USER_NOT_FOUND = 'REFUGE_OR_USER_NOT_FOUND',
  PROGRAMMING_ERROR = 'PROGRAMMING_ERROR',
  SERVER_ERROR = 'SERVER_DATA_ERROR',
  NOT_ALLOWED_CREATION_FOR_USER = 'NOT_ALLOWED_CREATION_FOR_USER',
  NOT_AUTHENTICATED_OR_INVALID_DATE = 'NOT_AUTHENTICATED_OR_INVALID_DATE',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  NTP_SERVER_IS_DOWN = 'NTP_SERVER_IS_DOWN',
}

export namespace CreateReservationError {
  export function from(
    error: HttpErrorResponse,
  ): CreateReservationError | never {
    return match(error.status)
      .with(0, () => {
        throw new Error('You are offline or the server is down.');
      })
      .with(
        HttpStatusCode.Unauthorized,
        () => CreateReservationError.NOT_AUTHENTICATED_OR_INVALID_DATE,
      )
      .with(
        HttpStatusCode.NotFound,
        () => CreateReservationError.REFUGE_OR_USER_NOT_FOUND,
      )
      .with(
        HttpStatusCode.Forbidden,
        () => CreateReservationError.NOT_ALLOWED_CREATION_FOR_USER,
      )
      .with(
        HttpStatusCode.UnprocessableEntity,
        () => CreateReservationError.PROGRAMMING_ERROR,
      )
      .with(
        HttpStatusCode.InternalServerError,
        () => CreateReservationError.NTP_SERVER_IS_DOWN,
      )
      .otherwise(() => CreateReservationError.UNKNOWN_ERROR);
  }
}

export type CorrectCreateReservation = {
  status: 'ok';
  reservation: ReservationWithId;
};

export type ErrorCreateReservation = {
  status: 'error';
  error: CreateReservationError;
};

export type CreateReservation =
  | CorrectCreateReservation
  | ErrorCreateReservation;

export function fromResponse(response: any): CreateReservation {
  if (isMatching(ReservationPattern, response))
    return { status: 'ok', reservation: response };
  return { status: 'error', error: CreateReservationError.SERVER_ERROR };
}

export function fromError(error: HttpErrorResponse): CreateReservation | never {
  return {
    status: 'error',
    error: CreateReservationError.from(error),
  };
}
