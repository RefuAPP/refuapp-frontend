import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { isMatching, match } from 'ts-pattern';
import {
  Reservation,
  ReservationPattern,
  ReservationWithId,
} from './reservation';
import { ServerErrors } from '../errors/server';
import { PermissionsErrors } from '../errors/permissions';
import { CommonErrors } from '../errors/common';
import { CreateReservationDataError } from './create-reservation';
import { AuthenticationErrors } from '../auth/errors';

export enum DeleteReservationDataError {
  RESERVATION_NOT_FOUND = 'RESERVATION_NOT_FOUND',
}

export type DeleteReservationError =
  | DeleteReservationDataError
  | ServerErrors
  | PermissionsErrors
  | CommonErrors;

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
        () => PermissionsErrors.NOT_AUTHENTICATED,
      )
      .with(
        HttpStatusCode.NotFound,
        () => DeleteReservationDataError.RESERVATION_NOT_FOUND,
      )
      .with(
        HttpStatusCode.Forbidden,
        () => PermissionsErrors.NOT_ALLOWED_OPERATION_FOR_USER,
      )
      .with(
        HttpStatusCode.UnprocessableEntity,
        () => CommonErrors.PROGRAMMING_ERROR,
      )
      .otherwise(() => ServerErrors.UNKNOWN_ERROR);
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
  return { status: 'error', error: ServerErrors.INCORRECT_DATA_FORMAT };
}

export function fromError(error: HttpErrorResponse): DeleteReservation | never {
  return {
    status: 'error',
    error: DeleteReservationError.from(error),
  };
}
