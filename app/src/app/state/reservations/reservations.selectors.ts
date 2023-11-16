import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { match } from 'ts-pattern';
import { ServerErrors } from '../../schemas/errors/server';
import { PermissionsErrors } from '../../schemas/errors/permissions';
import { CreateReservationDataError } from '../../schemas/reservations/create-reservation';
import { ResourceErrors } from '../../schemas/errors/resource';

export const selectReservations = (state: AppState) => state.reservations;

export const getReservationsSortedByRefuge = createSelector(
  selectReservations,
  (reservations) => reservations.reservations,
);

export const getCreateReservationErrors = createSelector(
  selectReservations,
  (reservations) => {
    if (reservations.createError) {
      return match(reservations.createError)
        .with(
          CreateReservationDataError.INVALID_DATE,
          () => 'TODO: INVALID_DATE_STRING',
        )
        .with(
          CreateReservationDataError.NTP_SERVER_IS_DOWN,
          () => 'TODO: NTP_SERVER_IS_DOWN_STRING',
        )
        .with(
          CreateReservationDataError.REFUGE_OR_USER_NOT_FOUND,
          () => 'TODO: REFUGE_OR_USER_NOT_FOUND_STRING',
        )
        .with(
          ServerErrors.UNKNOWN_ERROR,
          ServerErrors.INCORRECT_DATA_FORMAT_OF_SERVER,
          ServerErrors.INCORRECT_DATA_FORMAT_OF_CLIENT,
          () => 'TODO: SERVER ERROR / PROGRAMMING ERROR',
        )
        .with(
          PermissionsErrors.NOT_ALLOWED_OPERATION_FOR_USER,
          PermissionsErrors.NOT_AUTHENTICATED,
          () => 'TODO: PERMISSIONS_ERROR_STRING',
        )
        .with(
          'connectionError',
          () => 'TODO: CONNECTION_ERROR_STRING_WHILE_CREATING_RESERVATION',
        )
        .exhaustive();
    }
    return null;
  },
);

export const getDeleteReservationErrors = createSelector(
  selectReservations,
  (reservations) => {
    if (reservations.deleteError)
      return match(reservations.deleteError)
        .with(
          ResourceErrors.NOT_FOUND,
          () => 'TODO: RESERVATION_NOT_FOUND_STRING',
        )
        .with(
          ServerErrors.UNKNOWN_ERROR,
          ServerErrors.INCORRECT_DATA_FORMAT_OF_SERVER,
          ServerErrors.INCORRECT_DATA_FORMAT_OF_CLIENT,
          () => 'TODO: SERVER_ERROR_STRING',
        )
        .with(
          PermissionsErrors.NOT_ALLOWED_OPERATION_FOR_USER,
          PermissionsErrors.NOT_AUTHENTICATED,
          () => 'TODO: PERMISSIONS_ERROR_STRING',
        )
        .with(
          'connectionError',
          () => 'TODO: CONNECTION_ERROR_STRING_WHILE_DELETING_RESERVATION',
        )
        .exhaustive();
    return null;
  },
);

export const addedNewReservation = createSelector(
  selectReservations,
  (reservations) => reservations.hasNewReservation,
);

export const deletedReservation = createSelector(
  selectReservations,
  (reservations) => reservations.hasDeletedReservation,
);

export const isDoingReservationOperation = createSelector(
  selectReservations,
  (reservations) => reservations.isLoading,
);
