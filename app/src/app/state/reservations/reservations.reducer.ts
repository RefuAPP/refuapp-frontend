import { createReducer, on } from '@ngrx/store';
import {
  addedReservation,
  addReservation,
  deletedReservation,
  deleteReservation,
  errorAddingReservation,
  errorDeletingReservation,
  fetchReservations,
} from './reservations.actions';
import { RefugeReservationsRelations } from '../../services/reservations/grouped-by/refuge';

export type ReservationsState = {
  reservations: RefugeReservationsRelations;
  createError?: any;
  deleteError?: any;
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
    deleteError: undefined,
    isLoading: true,
  })),
  on(fetchReservations, (state, action) => ({
    ...state,
    reservations: action.reservations,
  })),
  on(addReservation, (state, action) => ({
    ...state,
    createError: undefined,
    isLoading: true,
  })),
  on(addedReservation, (state, action) => ({
    ...state,
    isLoading: false,
  })),
  on(deletedReservation, (state, action) => ({
    ...state,
    isLoading: false,
    reservations: removeReservationWithId(
      action.reservation.id,
      state.reservations,
    ),
  })),
  on(errorAddingReservation, (state, action) => ({
    ...state,
    isLoading: false,
    createError: action.error,
  })),
  on(errorDeletingReservation, (state, action) => ({
    ...state,
    isLoading: false,
    deleteError: action.error,
  })),
);

function removeReservationWithId(
  id: string,
  reservations: RefugeReservationsRelations,
) {
  return reservations.map((relation) => {
    return {
      ...relation,
      reservations: relation.reservations.filter(
        (reservation) => reservation.id !== id,
      ),
    };
  });
}
