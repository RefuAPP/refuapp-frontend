import { Injectable } from '@angular/core';
import {
  Actions,
  createEffect,
  ofType,
  ROOT_EFFECTS_INIT,
} from '@ngrx/effects';
import { combineLatest, map, mergeMap, switchMap } from 'rxjs';
import { loginCompleted } from '../auth/auth.actions';
import { UserReservationService } from '../../services/reservations/user-reservation.service';
import {
  addedReservation,
  addReservation,
  deletedReservation,
  deleteReservation,
  errorAddingReservation,
  errorDeletingReservation,
  fetchReservations,
} from './reservations.actions';
import { ReservationsService } from '../../services/reservations/reservations.service';
import { orderByRefuge } from '../../services/reservations/grouped-by/refuge';
import { RefugeService } from '../../services/refuge/refuge.service';

@Injectable()
export class ReservationsEffects {
  reservationFactory = (refugeId: string) =>
    this.refugeService.getRefugeIgnoringErrorsFrom(refugeId);

  constructor(
    private actions$: Actions,
    private userReservationService: UserReservationService,
    private reservationService: ReservationsService,
    private refugeService: RefugeService,
  ) {}

  fetchReservationsOnLoggedUser$ = createEffect(() =>
    combineLatest([
      this.actions$.pipe(ofType(loginCompleted)),
      this.actions$.pipe(ofType(ROOT_EFFECTS_INIT)),
    ]).pipe(
      switchMap((actions) =>
        // TODO: this is doing it every 3 seconds, maybe we shouldn't pull?
        this.userReservationService
          .getReservationsGroupedByRefugeForUser(actions[0].userId)
          .pipe(
            map((reservations) => {
              return fetchReservations({ reservations });
            }),
          ),
      ),
    ),
  );

  deleteReservationsOnDelete$ = createEffect(() =>
    combineLatest([
      this.actions$.pipe(ofType(loginCompleted)),
      this.actions$.pipe(ofType(deleteReservation)),
    ]).pipe(
      switchMap((action) =>
        this.reservationService.deleteReservation(action[1].id).pipe(
          map((reservations) => {
            if (reservations.status == 'ok')
              return deletedReservation({
                reservation: reservations.reservation,
              });
            return errorDeletingReservation({ error: reservations.error });
          }),
        ),
      ),
    ),
  );

  addReservation$ = createEffect(() =>
    combineLatest([
      this.actions$.pipe(ofType(loginCompleted)),
      this.actions$.pipe(ofType(addReservation)),
    ]).pipe(
      switchMap((actions) =>
        this.reservationService
          .createReservation({
            user_id: actions[0].userId,
            ...actions[1].reservation,
          })
          .pipe(
            map((reservations) => {
              if (reservations.status == 'ok')
                return addedReservation({
                  reservation: reservations.reservation,
                });
              return errorAddingReservation({ error: reservations.error });
            }),
          ),
      ),
    ),
  );

  fetchReservationsAgainAfterAdd$ = createEffect(() =>
    combineLatest([
      this.actions$.pipe(ofType(loginCompleted)),
      this.actions$.pipe(ofType(addedReservation)),
    ]).pipe(
      switchMap((actions) =>
        this.userReservationService
          .getReservationsForUserFromCurrentDate(actions[0].userId)
          .pipe(
            mergeMap((reservations) =>
              orderByRefuge(reservations, this.reservationFactory),
            ),
            map((reservations) => fetchReservations({ reservations })),
          ),
      ),
    ),
  );
}
