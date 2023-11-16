import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { AllErrors } from '../../schemas/errors/all-errors';
import { match } from 'ts-pattern';
import { ServerErrors } from '../../schemas/errors/server';
import { ResourceErrors } from '../../schemas/errors/resource';
import { PermissionsErrors } from '../../schemas/errors/permissions';
import { DeviceErrors } from '../../schemas/errors/device';
import { fatalError } from './error.actions';

@Injectable()
export class ErrorEffects {
  constructor(
    private actions$: Actions,
    private router: Router,
  ) {}

  redirectOnFatalError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fatalError),
        tap((error) => this.redirect(error.error)),
      ),
    { dispatch: false },
  );

  private redirect(error: AllErrors) {
    match(error)
      .with(ServerErrors.UNKNOWN_ERROR, () =>
        this.router.navigate(['/internal-error-page']).then(),
      )
      .with(
        ServerErrors.INCORRECT_DATA_FORMAT_OF_SERVER,
        ServerErrors.INCORRECT_DATA_FORMAT_OF_CLIENT,
        () => this.router.navigate(['/programming-error']).then(),
      )
      .with(ResourceErrors.NOT_FOUND, () =>
        this.router.navigate(['/not-found-page']).then(),
      )
      .with(
        PermissionsErrors.NOT_AUTHENTICATED,
        PermissionsErrors.NOT_ALLOWED_OPERATION_FOR_USER,
        () => console.log('TODO'),
      )
      .with(DeviceErrors.NOT_CONNECTED, () => {
        console.log('TODO');
      });
  }
}
