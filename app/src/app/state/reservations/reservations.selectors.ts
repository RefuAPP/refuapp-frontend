import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';

export const selectReservations = (state: AppState) => state.reservations;

export const getReservationsSortedByRefuge = createSelector(
  selectReservations,
  (reservations) => reservations.reservations,
);

export const isDoingReservationOperation = createSelector(
  selectReservations,
  (reservations) => reservations.isLoading,
);
