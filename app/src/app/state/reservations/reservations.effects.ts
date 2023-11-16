import { Injectable } from '@angular/core';
import {
  Actions,
  createEffect,
  ofType,
  ROOT_EFFECTS_INIT,
} from '@ngrx/effects';
import {
  catchError,
  combineLatest,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';
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
import { DeviceErrors } from '../../schemas/errors/device';
import { customMinorError, minorError } from '../errors/error.actions';
import { TypedAction } from '@ngrx/store/src/models';
import { ReservationWithoutUserId } from '../../schemas/reservations/reservation';
import { CreateReservationDataError } from '../../schemas/reservations/create-reservation';

@Injectable()
export class ReservationsEffects {
  constructor(
    private actions$: Actions,
    private userReservationService: UserReservationService,
    private reservationService: ReservationsService,
  ) {}

  fetchReservationsOnLoggedUser$ = createEffect(() =>
    combineLatest([
      this.actions$.pipe(ofType(loginCompleted)),
      this.actions$.pipe(ofType(ROOT_EFFECTS_INIT)),
    ]).pipe(switchMap((actions) => this.fetchReservations(actions[0].userId))),
  );

  private fetchReservations(userId: string): Observable<any> {
    // TODO: this is doing it every 3 seconds, maybe we shouldn't pull?
    return this.userReservationService
      .getReservationsGroupedByRefugeForUser(userId)
      .pipe(
        map((reservations) => fetchReservations({ reservations })),
        catchError(() => of(minorError({ error: DeviceErrors.NOT_CONNECTED }))),
      );
  }

  deleteReservation$ = createEffect(() =>
    combineLatest([
      this.actions$.pipe(ofType(loginCompleted)),
      this.actions$.pipe(ofType(deleteReservation)),
    ]).pipe(switchMap((actions) => this.deleteReservation(actions[1].id))),
  );

  private deleteReservation(reservationId: string): Observable<any> {
    return this.reservationService.deleteReservation(reservationId).pipe(
      map((reservations) => {
        if (reservations.status == 'ok')
          // TODO: add side effect of ok message
          return [
            deletedReservation({
              reservation: reservations.reservation,
            }),
          ];
        return [
          errorDeletingReservation(),
          minorError({ error: reservations.error }),
        ];
      }),
      catchError((error) => [
        errorDeletingReservation(),
        minorError({ error: DeviceErrors.NOT_CONNECTED }),
      ]),
    );
  }

  addReservation$ = createEffect(() =>
    combineLatest([
      this.actions$.pipe(ofType(loginCompleted)),
      this.actions$.pipe(ofType(addReservation)),
    ]).pipe(
      switchMap((actions) =>
        this.createReservation(actions[0].userId, actions[1].reservation),
      ),
    ),
  );

  private createReservation(
    userId: string,
    reservation: ReservationWithoutUserId,
  ): Observable<any> {
    return this.reservationService
      .createReservation({
        user_id: userId,
        ...reservation,
      })
      .pipe(
        map((reservations) => {
          if (reservations.status == 'ok')
            // TODO: add side effect of ok message
            return [
              addedReservation({
                reservation: reservations.reservation,
              }),
            ];
          if (
            reservations.error ===
              CreateReservationDataError.NTP_SERVER_IS_DOWN ||
            reservations.error === CreateReservationDataError.INVALID_DATE ||
            reservations.error ===
              CreateReservationDataError.REFUGE_OR_USER_NOT_FOUND
          )
            return [
              errorAddingReservation(),
              customMinorError({ error: reservations.error }),
            ];
          return minorError({
            error: reservations.error,
          });
        }),
        catchError(() => of(minorError({ error: DeviceErrors.NOT_CONNECTED }))),
      );
  }

  fetchReservationsAgainAfterAdd$ = createEffect(() =>
    combineLatest([
      this.actions$.pipe(ofType(loginCompleted)),
      this.actions$.pipe(ofType(addedReservation)),
    ]).pipe(switchMap((actions) => this.fetchReservations(actions[0].userId))),
  );
}
