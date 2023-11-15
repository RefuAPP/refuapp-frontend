import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs';
import { closeModal, openModal } from './modal.actions';
import { Location } from '@angular/common';

@Injectable()
export class ModalEffects {
  constructor(
    private actions$: Actions,
    private location: Location,
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
        tap((createData) => this.location.go('/home/')),
      ),
    { dispatch: false },
  );
}
