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
  loginResponseError,
  logOutCompleted,
  logOutRequest,
} from './auth.actions';
import { map, switchMap, tap } from 'rxjs';
import { match } from 'ts-pattern';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';

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
            else return loginCompleted();
          }),
        ),
      ),
    ),
  );

  sendLoginRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginRequest),
      switchMap((request) => this.authService.getToken(request)),
      map((action) => {
        return match(action)
          .with({ status: 'error' }, (errorResponse) =>
            loginResponseError({ error: errorResponse.error }),
          )
          .with({ status: 'authenticated' }, (correctResponse) =>
            loginResponseCorrect(correctResponse.data),
          )
          .exhaustive();
      }),
    ),
  );

  errorLoginRequest$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginResponseError),
        tap((action) => {
          console.log(action.error);
        }),
      ),
    { dispatch: false },
  );

  saveJWTWhenLoginResponseIsCorrect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginResponseCorrect),
      switchMap((action) => fromPromise(this.authService.authenticate(action))),
      map(() => loginCompleted()),
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
