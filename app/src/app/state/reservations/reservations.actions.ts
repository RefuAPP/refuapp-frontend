import { createAction, props } from '@ngrx/store';
import {
  ReservationWithId,
  ReservationWithoutUserId,
} from '../../schemas/reservations/reservation';
import { RefugeReservationsRelations } from '../../services/reservations/grouped-by/refuge';
import {
  CreateReservationError,
  ErrorCreateReservation,
} from '../../schemas/reservations/create-reservation';
import {
  DeleteReservationError,
  ErrorDeleteReservation,
} from '../../schemas/reservations/delete-reservation';

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

export const errorAddingReservation = createAction(
  '[Reservations] Error Adding Reservation',
  props<{ error: CreateReservationError }>(),
);

export const deleteReservation = createAction(
  '[Reservations] Delete Reservation',
  props<{ id: string }>(),
);

export const deletedReservation = createAction(
  '[Reservations] Deleted Reservation',
  props<{ reservation: ReservationWithId }>(),
);

export const errorDeletingReservation = createAction(
  '[Reservations] Error Deleting Reservation',
  props<{ error: DeleteReservationError }>(),
);
