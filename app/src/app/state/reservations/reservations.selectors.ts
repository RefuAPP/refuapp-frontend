import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';

export const selectReservations = (state: AppState) => state.reservations;

export const getReservationsSortedByRefuge = createSelector(
  selectReservations,
  (reservations) => reservations.reservations,
);

export const getCreateReservationErrors = createSelector(
  selectReservations,
  (reservations) => reservations.createError,
);

export const isLoadingReservations = createSelector(
  selectReservations,
  (reservations) => reservations.isLoading,
);
