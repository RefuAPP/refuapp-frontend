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

  readonly fetchReservations = this.effect((trigger$: Observable<void>) =>
    trigger$.pipe(
      concatMap(() =>
        fromPromise(this.authService.isAuthenticated()).pipe(
          concatMap((isAuth) => {
            if (isAuth) return this.fetchReservations$();
            return of(EMPTY);
          }),
        ),
      ),
    ),
  );

  private fetchReservations$() {
    return fromPromise(this.authService.getUserId()).pipe(
      concatMap((userId) => {
        if (userId != null) {
          return this.getReservations(userId);
        }
        this.store.dispatch(
          fatalError({ error: PermissionsErrors.NOT_AUTHENTICATED }),
        );
        return of(EMPTY);
      }),
    );
  }

  private getReservations(userId: string) {
    this.patchState({ isLoading: true });
    return this.userReservationService
      .getReservationsGroupedByRefugeForUser(userId)
      .pipe(
        tapResponse(
          (reservations) => {
            this.patchState({ reservations, isLoading: false });
            this.store.dispatch(
              showMessages({
                message: 'TODO: Reservas cargadas correctamente',
              }),
            );
          },
          () => {
            this.patchState({ isLoading: false });
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
      tapResponse(
        (reservations) => {
          this.store.dispatch(
            showMessages({ message: 'TODO: Reserva eliminada correctamente' }),
          );
          this.patchState((state) => {
            return {
              reservations: this.removeReservationWithId(
                reservationId,
                state.reservations,
              ),
              isLoading: false,
            };
          });
        },
        () => {
          this.patchState({ isLoading: false });
          this.store.dispatch(
            minorError({ error: DeviceErrors.NOT_CONNECTED }),
          );
        },
      ),
    );
  }

  readonly createReservation = this.effect(
    (reservation: Observable<ReservationWithoutUserId>) =>
      reservation.pipe(
        tap(() => console.log('Creating reservation...')),
        concatMap((reservation) => this.createReservation$(reservation)),
        switchMap(() => this.fetchReservations$()),
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
        tapResponse(
          (reservations) => {
            match(reservations)
              .with({ status: 'ok' }, (res) => {
                this.store.dispatch(
                  showMessages({
                    message: 'TODO: Reserva creada correctamente',
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
      );
  }

  private handleCreateError(error: CreateReservationError) {
    match(error)
      .with(CreateReservationDataError.NTP_SERVER_IS_DOWN, () =>
        this.store.dispatch(customMinorError({ error })),
      )
      .with(CreateReservationDataError.INVALID_DATE, () =>
        this.store.dispatch(customMinorError({ error })),
      )
      .with(CreateReservationDataError.REFUGE_OR_USER_NOT_FOUND, () =>
        this.store.dispatch(customMinorError({ error })),
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
