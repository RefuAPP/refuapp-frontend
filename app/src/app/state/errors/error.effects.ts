import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { concatMap, map, tap } from 'rxjs';
import { AllErrors } from '../../schemas/errors/all-errors';
import { match } from 'ts-pattern';
import { ServerErrors } from '../../schemas/errors/server';
import { ResourceErrors } from '../../schemas/errors/resource';
import { PermissionsErrors } from '../../schemas/errors/permissions';
import { DeviceErrors } from '../../schemas/errors/device';
import {
  customMinorError,
  fatalError,
  fixFatalError,
  minorError,
} from './error.actions';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';

@Injectable()
export class ErrorEffects {
  constructor(
    private actions$: Actions,
    private router: Router,
  ) {}

  redirectOnFatalError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fatalError),
      tap((error) => this.redirect(error.error)),
    ),
  );

  restartGoToHome$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fixFatalError),
        concatMap(() =>
          fromPromise(
            this.router.navigate(['/'], {
              onSameUrlNavigation: 'reload',
              skipLocationChange: true,
            }),
          ),
        ),
        tap(() => window.location.reload()),
      ),
    { dispatch: false },
  );

  createCustomMinorErrorFromNormalError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(minorError),
      map((error) =>
        customMinorError({ error: this.getStringFor(error.error) }),
      ),
    ),
  );

  private getStringFor(error: AllErrors): string {
    return match(error)
      .with(ServerErrors.UNKNOWN_ERROR, () => 'MINOR_ERRORS.UNKNOWN')
      .with(
        ServerErrors.INCORRECT_DATA_FORMAT_OF_CLIENT,
        () => 'MINOR_ERRORS.INCORRECT_DATA_FORMAT_OF_CLIENT',
      )
      .with(
        ServerErrors.INCORRECT_DATA_FORMAT_OF_SERVER,
        () => 'MINOR_ERRORS.INCORRECT_DATA_FORMAT_OF_SERVER',
      )
      .with(ResourceErrors.NOT_FOUND, () => 'MINOR_ERRORS.NOT_FOUND')
      .with(
        PermissionsErrors.NOT_AUTHENTICATED,
        () => 'MINOR_ERRORS.NOT_AUTHENTICATED',
      )
      .with(
        PermissionsErrors.NOT_ALLOWED_OPERATION_FOR_USER,
        () => 'MINOR_ERRORS.NOT_ALLOWED_OPERATION_FOR_USER',
      )
      .with(DeviceErrors.NOT_CONNECTED, () => 'MINOR_ERRORS.NOT_CONNECTED')
      .exhaustive();
  }

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
      .with(PermissionsErrors.NOT_AUTHENTICATED, () =>
        this.router.navigate(['/login']).then(),
      )
      .with(PermissionsErrors.NOT_ALLOWED_OPERATION_FOR_USER, () =>
        this.router.navigate(['/forbidden']).then(),
      )
      .with(DeviceErrors.NOT_CONNECTED, () => {})
      .exhaustive();
  }
}
