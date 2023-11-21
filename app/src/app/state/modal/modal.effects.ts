import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, of, tap } from 'rxjs';
import { closeModal, openModal, openModalWithRefugeId } from './modal.actions';
import { Location } from '@angular/common';
import { RefugeService } from '../../services/refuge/refuge.service';
import { fatalError, minorError } from '../errors/error.actions';
import { DeviceErrors } from '../../schemas/errors/device';

@Injectable()
export class ModalEffects {
  constructor(
    private actions$: Actions,
    private location: Location,
    private refugeService: RefugeService,
  ) {}

  onModalOpenChangeUrl$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(openModal),
        tap((createData) => this.location.go('/home/' + createData.refuge.id)),
      ),
    { dispatch: false },
  );

  onModalClosedChangeUrl$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(closeModal),
        tap((action) => {
          if (action.redirectHome) this.location.go('/home/');
        }),
      ),
    { dispatch: false },
  );

  loadRefugeIfModalOpened$ = createEffect(() =>
    this.actions$.pipe(
      ofType(openModalWithRefugeId),
      concatMap((action) => this.fetchRefuge(action.refugeId)),
    ),
  );

  private fetchRefuge(refugeId: string) {
    return this.refugeService.getRefugeFrom(refugeId).pipe(
      map((refuge) => {
        if (refuge.status === 'correct') {
          return openModal({ refuge: refuge.data });
        }
        return fatalError({ error: refuge.error });
      }),
      catchError(() => of(minorError({ error: DeviceErrors.NOT_CONNECTED }))),
    );
  }
}
