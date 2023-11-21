import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { isMatching, match } from 'ts-pattern';
import { ReservationPattern, ReservationWithId } from './reservation';
import { ServerErrors } from '../errors/server';
import { PermissionsErrors } from '../errors/permissions';
import { getErrorFrom } from '../errors/all-errors';

export enum CreateReservationDataError {
  REFUGE_OR_USER_NOT_FOUND = 'REFUGE_OR_USER_NOT_FOUND',
  INVALID_DATE_ALREADY_RESERVED = 'INVALID_DATE_ALREADY_RESERVED',
  INVALID_DATE_PAST_DATE = 'INVALID_DATE_IS_PAST',
  NTP_SERVER_IS_DOWN = 'NTP_SERVER_IS_DOWN',
}

export type CreateReservationError =
  | CreateReservationDataError
  | ServerErrors
  | PermissionsErrors;

export namespace CreateReservationError {
  export function from(
    error: HttpErrorResponse,
  ): CreateReservationError | never {
    return match(error.status)
      .with(HttpStatusCode.Forbidden, () => {
        if (
          error.error.detail != undefined &&
          error.error.detail.includes(
            'User already has a reservation on this date',
          )
        )
          return CreateReservationDataError.INVALID_DATE_ALREADY_RESERVED;
        if (
          error.error.detail !== undefined &&
          error.error.detail.includes(
            'You cannot make a reservation for a past date',
          )
        )
          return CreateReservationDataError.INVALID_DATE_PAST_DATE;
        return PermissionsErrors.NOT_ALLOWED_OPERATION_FOR_USER;
      })
      .with(
        HttpStatusCode.InternalServerError,
        () => CreateReservationDataError.NTP_SERVER_IS_DOWN,
      )
      .otherwise(() => getErrorFrom(error) as ServerErrors | PermissionsErrors);
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
  return {
    status: 'error',
    error: ServerErrors.INCORRECT_DATA_FORMAT_OF_SERVER,
  };
}

export function fromError(error: HttpErrorResponse): CreateReservation | never {
  return {
    status: 'error',
    error: CreateReservationError.from(error),
  };
}
