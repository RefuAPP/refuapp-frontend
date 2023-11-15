import { createAction, props } from '@ngrx/store';
import {
  ReservationWithId,
  ReservationWithoutUserId,
} from '../../schemas/reservations/reservation';
import { RefugeReservationsRelations } from '../../services/reservations/grouped-by/refuge';
import { CreateReservationError } from '../../schemas/reservations/create-reservation';
import { DeleteReservationError } from '../../schemas/reservations/delete-reservation';

export const addReservation = createAction(
  '[Reservations] Add Reservation',
  props<{ reservation: ReservationWithoutUserId }>(),
);

export const addedReservation = createAction(
  '[Reservations] Added Reservation',
  props<{ reservation: ReservationWithId }>(),
);

export const fetchReservations = createAction(
  '[Reservations] Fetched Reservations',
  props<{ reservations: RefugeReservationsRelations }>(),
);

export const connectionErrorFetchReservations = createAction(
  '[Reservations] Fetch Reservations had a connection error',
);

export const errorAddingReservation = createAction(
  '[Reservations] Error Adding Reservation',
  props<{ error: CreateReservationError }>(),
);

export const connectionErrorAddReservation = createAction(
  '[Reservations] Add Reservation had a connection error',
);

export const deleteReservation = createAction(
  '[Reservations] Delete Reservation',
  props<{ id: string }>(),
);

export const connectionErrorDeleteReservation = createAction(
  '[Reservations] Delete Reservation had a connection error',
);

export const deletedReservation = createAction(
  '[Reservations] Deleted Reservation',
  props<{ reservation: ReservationWithId }>(),
);

export const errorDeletingReservation = createAction(
  '[Reservations] Error Deleting Reservation',
  props<{ error: DeleteReservationError }>(),
);
