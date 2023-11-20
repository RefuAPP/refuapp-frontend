import { createReducer, on } from '@ngrx/store';
import {
  addedReservation,
  addReservation,
  deletedReservation,
  deleteReservation,
  errorAddingReservation,
  errorDeletingReservation,
  errorFetchingReservations,
  fetchReservations,
} from './reservations.actions';
import { RefugeReservationsRelations } from '../../services/reservations/grouped-by/refuge';

export type ReservationsState = {
  reservations: RefugeReservationsRelations;
  isLoading: boolean;
};

export const reservationState = {
  reservations: [],
  isLoading: false,
} as ReservationsState;

export const reservationsReducer = createReducer(
  reservationState,
  on(deleteReservation, (state, action) => ({
    ...state,
    isLoading: true,
  })),
  on(fetchReservations, (state, action) => ({
    ...state,
    isLoading: true,
  })),
  on(errorFetchingReservations, (state, action) => ({
    ...state,
    isLoading: false,
  })),
  on(addReservation, (state, action) => ({
    ...state,
    isLoading: true,
  })),
  on(addedReservation, (state, action) => ({
    ...state,
    isLoading: false,
  })),
  on(deletedReservation, (state, action) => ({
    isLoading: false,
    reservations: removeReservationWithId(
      action.reservation.id,
      state.reservations,
    ),
  })),
  on(errorAddingReservation, (state) => ({
    ...state,
    isLoading: false,
  })),
  on(errorDeletingReservation, (state) => ({
    ...state,
    isLoading: false,
  })),
);

function removeReservationWithId(
  id: string,
  reservations: RefugeReservationsRelations,
) {
  return reservations
    .map((relation) => {
      const newReservations = relation.reservations.filter(
        (reservation) => reservation.id !== id,
      );
      if (newReservations.length !== 0)
        return {
          ...relation,
          reservations: newReservations,
        };
      return null;
    })
    .filter((relation) => relation !== null) as RefugeReservationsRelations;
}
