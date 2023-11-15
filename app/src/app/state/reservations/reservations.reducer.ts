import { createReducer, on } from '@ngrx/store';
import {
  addedReservation,
  addReservation,
  connectionErrorAddReservation,
  connectionErrorDeleteReservation,
  connectionErrorFetchReservations,
  deletedReservation,
  deleteReservation,
  errorAddingReservation,
  errorDeletingReservation,
  fetchReservations,
} from './reservations.actions';
import { RefugeReservationsRelations } from '../../services/reservations/grouped-by/refuge';
import { CreateReservationError } from '../../schemas/reservations/create-reservation';
import { DeleteReservationError } from '../../schemas/reservations/delete-reservation';

export type ReservationsState = {
  reservations: RefugeReservationsRelations;
  createError?: CreateReservationError | 'connectionError';
  deleteError?: DeleteReservationError | 'connectionError';
  isLoading: boolean;
  hasNewReservation: boolean;
  hasDeletedReservation: boolean;
};

export const reservationState = {
  reservations: [],
  isLoading: false,
  hasNewReservation: false,
  hasDeletedReservation: false,
} as ReservationsState;

export const reservationsReducer = createReducer(
  reservationState,
  on(deleteReservation, (state, action) => ({
    reservations: state.reservations,
    hasNewReservation: false,
    hasDeletedReservation: false,
    isLoading: true,
  })),
  on(fetchReservations, (state, action) => ({
    hasNewReservation: false,
    hasDeletedReservation: false,
    isLoading: false,
    reservations: action.reservations,
  })),
  on(connectionErrorFetchReservations, (state, action) => ({
    ...state,
    isLoading: false,
  })),
  on(connectionErrorAddReservation, (state, action) => ({
    ...state,
    createError: 'connectionError',
    isLoading: false,
  })),
  on(connectionErrorDeleteReservation, (state, action) => ({
    ...state,
    deleteError: 'connectionError',
    isLoading: false,
  })),
  on(addReservation, (state, action) => ({
    reservations: state.reservations,
    hasNewReservation: false,
    hasDeletedReservation: false,
    isLoading: true,
  })),
  on(addedReservation, (state, action) => ({
    reservations: state.reservations,
    hasNewReservation: true,
    hasDeletedReservation: false,
    isLoading: false,
  })),
  on(deletedReservation, (state, action) => ({
    isLoading: false,
    reservations: removeReservationWithId(
      action.reservation.id,
      state.reservations,
    ),
    hasNewReservation: false,
    hasDeletedReservation: true,
  })),
  on(errorAddingReservation, (state, action) => ({
    reservations: state.reservations,
    hasNewReservation: false,
    hasDeletedReservation: false,
    isLoading: false,
    createError: action.error,
  })),
  on(errorDeletingReservation, (state, action) => ({
    reservations: state.reservations,
    hasNewReservation: false,
    hasDeletedReservation: false,
    isLoading: false,
    deleteError: action.error,
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
