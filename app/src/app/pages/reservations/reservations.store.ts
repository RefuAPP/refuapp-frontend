import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { concatMap, EMPTY, Observable, of, switchMap, tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { DeviceErrors } from '../../schemas/errors/device';
import {
  customMinorError,
  fatalError,
  minorError,
} from '../../state/errors/error.actions';
import { AppState } from '@capacitor/app';
import { Store } from '@ngrx/store';
import { RefugeReservationsRelations } from '../../services/reservations/grouped-by/refuge';
import { AuthService } from '../../services/auth/auth.service';
import { ReservationsService } from '../../services/reservations/reservations.service';
import { UserReservationService } from '../../services/reservations/user-reservation.service';
import { PermissionsErrors } from '../../schemas/errors/permissions';
import { showMessages } from '../../state/messages/message.actions';
import { ReservationWithoutUserId } from '../../schemas/reservations/reservation';
import {
  CreateReservationDataError,
  CreateReservationError,
} from '../../schemas/reservations/create-reservation';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { match } from 'ts-pattern';
import {
  CorrectDeleteReservation,
  ErrorDeleteReservation,
} from '../../schemas/reservations/delete-reservation';

export interface ReservationsState {
  reservations: RefugeReservationsRelations;
  isLoading: boolean;
}

@Injectable()
export class ReservationsComponentStore extends ComponentStore<ReservationsState> {
  readonly reservations$: Observable<RefugeReservationsRelations> = this.select(
    (state) => state.reservations,
  );
  readonly isLoading$ = this.select((state) => state.isLoading);

  constructor(
    private userReservationService: UserReservationService,
    private authService: AuthService,
    private reservationService: ReservationsService,
    readonly store: Store<AppState>,
  ) {
    super({
      reservations: [],
      isLoading: false,
    });
  }

  readonly fetchReservations = this.effect((isUpdating$: Observable<boolean>) =>
    isUpdating$.pipe(
      concatMap((isUpdating) => {
        if (isUpdating) return this.fetchReservationsUpdate$();
        return this.fetchReservations$();
      }),
    ),
  );

  private fetchReservations$() {
    return fromPromise(this.authService.getUserId()).pipe(
      concatMap((userId) => {
        if (userId != null) return this.getReservations(userId, (_) => {});
        return of(EMPTY);
      }),
    );
  }

  private fetchReservationsUpdate$() {
    return fromPromise(this.authService.getUserId()).pipe(
      concatMap((userId) => {
        if (userId != null)
          return this.getReservations(userId, (reservations) => {
            this.store.dispatch(
              showMessages({
                message: 'RESERVATIONS.FETCH_OPERATION.CORRECT',
              }),
            );
          });
        this.store.dispatch(
          fatalError({ error: PermissionsErrors.NOT_AUTHENTICATED }),
        );
        return of(EMPTY);
      }),
    );
  }

  private getReservations(
    userId: string,
    onUpdate: (reservations: RefugeReservationsRelations) => void,
  ) {
    this.patchState({ isLoading: true });
    return this.userReservationService
      .getReservationsGroupedByRefugeForUser(userId)
      .pipe(
        tap(() => this.patchState({ isLoading: false })),
        tapResponse(
          (reservations) => {
            this.patchState({ reservations });
            onUpdate(reservations);
          },
          () => {
            this.store.dispatch(
              minorError({ error: DeviceErrors.NOT_CONNECTED }),
            );
          },
        ),
      );
  }

  readonly deleteReservation = this.effect((reservation: Observable<string>) =>
    reservation.pipe(concatMap((id) => this.deleteReservation$(id))),
  );

  private deleteReservation$(reservationId: string) {
    return fromPromise(this.authService.isAuthenticated()).pipe(
      concatMap((isAuthenticated) => {
        if (isAuthenticated)
          return this.deleteReservationForUser(reservationId);
        else {
          this.store.dispatch(
            fatalError({ error: PermissionsErrors.NOT_AUTHENTICATED }),
          );
          return of(EMPTY);
        }
      }),
    );
  }

  private deleteReservationForUser(reservationId: string) {
    this.patchState({ isLoading: true });
    return this.reservationService.deleteReservation(reservationId).pipe(
      tap(() => this.patchState({ isLoading: false })),
      tapResponse(
        (reservation) => this.onDeleteReservationResponse(reservation),
        () => {
          this.store.dispatch(
            minorError({ error: DeviceErrors.NOT_CONNECTED }),
          );
        },
      ),
    );
  }

  private onDeleteReservationResponse(
    reservation: CorrectDeleteReservation | ErrorDeleteReservation,
  ) {
    match(reservation)
      .with({ status: 'ok' }, (res) => {
        this.store.dispatch(
          showMessages({ message: 'RESERVATIONS.DELETE_OPERATION.CORRECT' }),
        );
        this.patchState((state) => {
          return {
            reservations: this.removeReservationWithId(
              res.reservation.id,
              state.reservations,
            ),
          };
        });
      })
      .with({ status: 'error' }, (err) => {
        this.store.dispatch(minorError({ error: err.error }));
      });
  }

  readonly createReservation = this.effect(
    (reservation: Observable<ReservationWithoutUserId>) =>
      reservation.pipe(
        concatMap((reservation) => this.createReservation$(reservation)),
      ),
  );

  private createReservation$(reservation: ReservationWithoutUserId) {
    return fromPromise(this.authService.getUserId()).pipe(
      concatMap((userId) => {
        if (userId != null)
          return this.createReservationFor(userId, reservation);
        else {
          this.store.dispatch(
            fatalError({ error: PermissionsErrors.NOT_AUTHENTICATED }),
          );
          return of(EMPTY);
        }
      }),
    );
  }

  private createReservationFor(
    userId: string,
    reservation: ReservationWithoutUserId,
  ) {
    this.patchState({ isLoading: true });
    return this.reservationService
      .createReservation({
        user_id: userId,
        ...reservation,
      })
      .pipe(
        tap(() => this.patchState({ isLoading: false })),
        tapResponse(
          (reservations) => {
            match(reservations)
              .with({ status: 'ok' }, (res) => {
                this.store.dispatch(
                  showMessages({
                    message: 'RESERVATIONS.CREATE_OPERATION.CORRECT',
                    props: { day: reservation.night.day },
                  }),
                );
              })
              .with({ status: 'error' }, (responseError) => {
                this.handleCreateError(responseError.error);
              });
          },
          () => {
            this.store.dispatch(
              minorError({ error: DeviceErrors.NOT_CONNECTED }),
            );
          },
        ),
        switchMap((response) => {
          if (response.status === 'ok') return this.fetchReservations$();
          else return of(EMPTY);
        }),
      );
  }

  private handleCreateError(error: CreateReservationError) {
    match(error)
      .with(CreateReservationDataError.NTP_SERVER_IS_DOWN, () =>
        this.store.dispatch(
          customMinorError({
            error: 'RESERVATIONS.CREATE_OPERATION.SERVER_ERROR',
          }),
        ),
      )
      .with(CreateReservationDataError.INVALID_DATE_ALREADY_RESERVED, () =>
        this.store.dispatch(
          customMinorError({
            error:
              'RESERVATIONS.CREATE_OPERATION.INVALID_DATE_ALREADY_RESERVED',
          }),
        ),
      )
      .with(CreateReservationDataError.REFUGE_OR_USER_NOT_FOUND, () =>
        this.store.dispatch(
          customMinorError({
            error: 'RESERVATIONS.CREATE_OPERATION.REFUGE_OR_USER_NOT_FOUND',
          }),
        ),
      )
      .with(CreateReservationDataError.INVALID_DATE_PAST_DATE, () =>
        this.store.dispatch(
          customMinorError({
            error: 'RESERVATIONS.CREATE_OPERATION.INVALID_DATE_PAST',
          }),
        ),
      )
      .otherwise((error) => this.store.dispatch(minorError({ error })));
  }

  private removeReservationWithId(
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
}
