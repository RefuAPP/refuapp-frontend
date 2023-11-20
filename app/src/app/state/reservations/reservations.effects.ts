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
  mergeMap,
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
  errorFetchingReservations,
  fetchReservations,
} from './reservations.actions';
import { ReservationsService } from '../../services/reservations/reservations.service';
import { DeviceErrors } from '../../schemas/errors/device';
import {
  customMinorError,
  fatalError,
  minorError,
} from '../errors/error.actions';
import { TypedAction } from '@ngrx/store/src/models';
import { ReservationWithoutUserId } from '../../schemas/reservations/reservation';
import { CreateReservationDataError } from '../../schemas/reservations/create-reservation';
import { showMessages } from '../messages/message.actions';
import { AuthService } from '../../services/auth/auth.service';
import { PermissionsErrors } from '../../schemas/errors/permissions';
import { closeModal } from '../components/modal/modal.actions';

@Injectable()
export class ReservationsEffects {
  constructor(
    private actions$: Actions,
    private userReservationService: UserReservationService,
    private authService: AuthService,
    private reservationService: ReservationsService,
  ) {}

  fetchReservationsOnLoggedUser$ = createEffect(() =>
    combineLatest([
      this.actions$.pipe(ofType(loginCompleted)),
      this.actions$.pipe(ofType(ROOT_EFFECTS_INIT)),
    ]).pipe(switchMap((actions) => this.fetchReservations(actions[0].userId))),
  );

  private fetchReservations(userId: string): Observable<any> {
    return this.userReservationService
      .getReservationsGroupedByRefugeForUser(userId)
      .pipe(
        map((reservations) => fetchReservations({ reservations })),
        catchError(() => [
          minorError({ error: DeviceErrors.NOT_CONNECTED }),
          errorFetchingReservations(),
        ]),
      );
  }

  deleteReservation$ = createEffect(() =>
    this.actions$.pipe(ofType(deleteReservation)).pipe(
      switchMap(async (action) => {
        return {
          isAuthenticated: await this.authService.isAuthenticated(),
          reservationId: action.id,
        };
      }),
      switchMap((a) => {
        if (a.isAuthenticated) return this.deleteReservation(a.reservationId);
        return [fatalError({ error: PermissionsErrors.NOT_AUTHENTICATED })];
      }),
    ),
  );

  private deleteReservation(reservationId: string): Observable<any> {
    return this.reservationService.deleteReservation(reservationId).pipe(
      map((reservations) => {
        if (reservations.status == 'ok')
          return [
            deletedReservation({
              reservation: reservations.reservation,
            }),
            showMessages({ message: 'TODO: Reserva eliminada correctamente' }),
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
    this.actions$.pipe(ofType(addReservation)).pipe(
      switchMap(async (action) => {
        return {
          isAuthenticated: await this.authService.isAuthenticated(),
          userId: await this.authService.getUserId(),
          reservation: action.reservation,
        };
      }),
      switchMap((petition) => {
        if (petition.isAuthenticated)
          return this.createReservation(
            petition.userId as string,
            petition.reservation,
          );
        return [fatalError({ error: PermissionsErrors.NOT_AUTHENTICATED })];
      }),
    ),
  );

  private createReservation(
    userId: string,
    reservation: ReservationWithoutUserId,
  ): Observable<TypedAction<any>> {
    return this.reservationService
      .createReservation({
        user_id: userId,
        ...reservation,
      })
      .pipe(
        mergeMap((reservations) => {
          if (reservations.status == 'ok') {
            return [
              addedReservation({
                reservation: reservations.reservation,
              }),
              showMessages({ message: 'TODO: Reserva creada correctamente' }),
            ];
          }
          if (
            reservations.error ===
              CreateReservationDataError.NTP_SERVER_IS_DOWN ||
            reservations.error === CreateReservationDataError.INVALID_DATE ||
            reservations.error ===
              CreateReservationDataError.REFUGE_OR_USER_NOT_FOUND
          ) {
            return [
              errorAddingReservation(),
              customMinorError({ error: reservations.error }),
            ];
          }
          return [
            minorError({
              error: reservations.error,
            }),
          ];
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
