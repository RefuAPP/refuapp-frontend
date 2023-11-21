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
  logOutCompleted,
  logOutRequest,
  login,
  loginFailed,
} from './auth.actions';
import { combineLatest, map, switchMap, tap } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { Router } from '@angular/router';
import { fatalError } from '../errors/error.actions';
import { ServerErrors } from 'src/app/schemas/errors/server';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private router: Router,
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

  saveTokenWhenLoginSilence$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      switchMap((action) =>
        fromPromise(this.authService.authenticate(action.token)),
      ),
      switchMap(() => this.authService.getUserId()),
      switchMap((userId) => {
        if (userId) return [loginCompleted({ userId })];
        return [
          loginFailed(),
          fatalError({ error: ServerErrors.UNKNOWN_ERROR }),
        ];
      }),
    ),
  );

  saveTokenWhenLogin$ = createEffect(
    () =>
      combineLatest([
        this.actions$.pipe(ofType(loginCompleted)),
        this.actions$.pipe(ofType(login)),
      ]).pipe(tap(() => this.router.navigate(['/']))),
    { dispatch: false },
  );

  deleteToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logOutRequest),
      switchMap(() => fromPromise(this.authService.deauthenticate())),
      map(() => logOutCompleted()),
    ),
  );
}
