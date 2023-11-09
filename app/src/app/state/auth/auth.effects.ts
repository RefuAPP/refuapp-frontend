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
import { map, of, switchMap } from 'rxjs';
import { isMatching, match } from 'ts-pattern';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import {
  AuthenticationErrors,
  DeviceErrors,
  ServerErrors,
  UserFormErrors,
} from '../../schemas/auth/errors';
import {
  CredentialsError,
  parseCredentials,
} from '../../schemas/auth/validate/forms';
import {
  UserCredentials,
  UserCredentialsPattern,
} from '../../schemas/user/user';
import { AuthenticationResponse } from '../../schemas/auth/authenticate';

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
      switchMap((request) => this.getNewStateFromLoginRequest(request)),
    ),
  );

  getNewStateFromLoginRequest(loginData: { credentials: UserCredentials }) {
    const userCredentialsOrError = parseCredentials(loginData.credentials);
    if (isMatching(UserCredentialsPattern, userCredentialsOrError))
      return this.fetchNewStateFromAuthApi(loginData);
    return of(
      loginResponseError({
        error: userCredentialsOrError as CredentialsError,
        credentials: loginData.credentials,
      }),
    );
  }

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

  private fetchNewStateFromAuthApi(loginData: {
    credentials: UserCredentials;
  }) {
    return this.authService
      .getToken(parseCredentials(loginData.credentials) as UserCredentials)
      .pipe(
        map((response) =>
          this.getNewStateFromAuthServerResponse(response, loginData),
        ),
      );
  }

  private getNewStateFromAuthServerResponse(
    response: AuthenticationResponse,
    loginData: {
      credentials: UserCredentials;
    },
  ) {
    return match(response)
      .with({ status: 'error' }, (errorResponse) =>
        this.getNewStateFromError(errorResponse.error, loginData),
      )
      .with({ status: 'authenticated' }, (correctResponse) =>
        loginResponseCorrect({ token: correctResponse.data }),
      )
      .exhaustive();
  }

  private getNewStateFromError(
    errorResponse: AuthenticationErrors,
    loginData: { credentials: UserCredentials },
  ) {
    return match(errorResponse)
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
        (err) =>
          loginResponseError({
            error: err,
            credentials: loginData.credentials,
          }),
      )
      .exhaustive();
  }
}
