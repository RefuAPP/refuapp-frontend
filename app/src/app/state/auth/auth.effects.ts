import { Injectable } from '@angular/core';
import {
  Actions,
  createEffect,
  ofType,
  ROOT_EFFECTS_INIT,
} from '@ngrx/effects';
import { AuthService } from 'src/app/services/auth/auth.service';
import {
  loginCompleted,
  loginRequest,
  loginResponseCorrect,
  loginResponseDeviceError,
  loginResponseError,
  logOutCompleted,
  logOutRequest,
} from './auth.actions';
import { map, switchMap } from 'rxjs';
import { match } from 'ts-pattern';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import {
  DeviceErrors,
  ServerErrors,
  UserFormErrors,
} from '../../schemas/auth/errors';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
  ) {}

  getCurrentStateFromAuthServiceWhenAppStarts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      switchMap(() =>
        fromPromise(this.authService.getUserId()).pipe(
          map((userId) => {
            if (userId == null) return logOutCompleted();
            else return loginCompleted({ userId });
          }),
        ),
      ),
    ),
  );

  sendLoginRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginRequest),
      switchMap((request) => this.authService.getToken(request.credentials)),
      map((action) => {
        return match(action)
          .with({ status: 'error' }, (errorResponse) =>
            match(errorResponse.error)
              .with(
                ServerErrors.UNKNOWN_ERROR,
                ServerErrors.INCORRECT_DATA_FORMAT,
                DeviceErrors.NOT_CONNECTED,
                (err) => loginResponseDeviceError({ error: err }),
              )
              .with(DeviceErrors.COULDN_T_SAVE_USER_DATA, () => {
                throw new Error('Impossible');
              })
              .with(
                UserFormErrors.USER_NOT_FOUND,
                UserFormErrors.INCORRECT_PASSWORD,
                (err) => loginResponseError({ error: err }),
              )
              .exhaustive(),
          )
          .with({ status: 'authenticated' }, (correctResponse) =>
            loginResponseCorrect({ token: correctResponse.data }),
          )
          .exhaustive();
      }),
    ),
  );

  saveJWTWhenLoginResponseIsCorrect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginResponseCorrect),
      switchMap((action) =>
        fromPromise(this.authService.authenticate(action.token)),
      ),
      switchMap(() => this.authService.getUserId()),
      map((userId) => {
        if (userId) return loginCompleted({ userId });
        return loginResponseDeviceError({
          error: DeviceErrors.COULDN_T_SAVE_USER_DATA,
        });
      }),
    ),
  );

  deleteToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logOutRequest),
      switchMap(() => fromPromise(this.authService.deauthenticate())),
      map(() => logOutCompleted()),
    ),
  );
}
