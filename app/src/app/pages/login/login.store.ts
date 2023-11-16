import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { filter, Observable, of, OperatorFunction, switchMap, tap } from 'rxjs';
import {
  UserCredentials,
  UserCredentialsPattern,
} from '../../schemas/user/user';
import { isMatching, match } from 'ts-pattern';
import { ServerErrors } from '../../schemas/errors/server';
import { Injectable } from '@angular/core';
import { EMPTY_OBSERVER } from 'rxjs/internal/Subscriber';
import {
  AuthenticationErrors,
  UserFormErrors,
} from '../../schemas/auth/errors';
import {
  CredentialsError,
  parseCredentials,
} from '../../schemas/auth/validate/forms';
import { AuthService } from '../../services/auth/auth.service';
import { AuthenticationResponse } from '../../schemas/auth/authenticate';
import { Token } from '../../schemas/auth/token';
import { AppState } from '../../state/app.state';
import { Store } from '@ngrx/store';
import { minorError } from '../../state/errors/error.actions';
import { DeviceErrors } from '../../schemas/errors/device';

export interface LoginState {
  credentials: UserCredentials;
  error?: UserFormErrors | CredentialsError;
  token?: Token;
  isLoading: boolean;
}

@Injectable()
export class LoginComponentStore extends ComponentStore<LoginState> {
  readonly form$: Observable<UserCredentials> = this.select(
    (state) => state.credentials,
  );
  readonly error$: Observable<UserFormErrors | CredentialsError> = this.select(
    (state) => state.error,
  ).pipe(
    filter((error) => error !== undefined) as OperatorFunction<
      UserFormErrors | CredentialsError | undefined,
      UserFormErrors | CredentialsError
    >,
  );
  readonly isLoading$: Observable<boolean> = this.select(
    (state) => state.isLoading,
  );
  readonly token$: Observable<Token> = this.select((state) => state.token).pipe(
    filter((token) => token !== undefined) as OperatorFunction<
      Token | undefined,
      Token
    >,
  );

  constructor(
    readonly authService: AuthService,
    private store: Store<AppState>,
  ) {
    super({
      credentials: {
        phone_number: '',
        password: '',
      },
      isLoading: false,
    });
  }

  readonly login = this.effect((form: Observable<UserCredentials>) =>
    form.pipe(
      tap((form) => this.patchState({ credentials: form })),
      switchMap((form: UserCredentials) =>
        this.getNewStateFromCreateUserRequest(form),
      ),
    ),
  );

  private getNewStateFromCreateUserRequest(credentials: UserCredentials) {
    const userCredentialsOrError = parseCredentials(credentials);
    if (isMatching(UserCredentialsPattern, userCredentialsOrError)) {
      return this.fetchNewStateFromAuthApi(
        userCredentialsOrError as UserCredentials,
      );
    } else {
      this.patchState({
        error: userCredentialsOrError as CredentialsError,
      });
      return of(EMPTY_OBSERVER);
    }
  }

  private fetchNewStateFromAuthApi(credentials: UserCredentials) {
    this.patchState({
      isLoading: true,
    });
    return this.authService.getToken(credentials).pipe(
      tapResponse(
        (response) => {
          this.patchState({
            isLoading: false,
          });
          this.getNewStateFromUserCreateServer(response);
        },
        (error) => {
          this.patchState({
            isLoading: false,
          });
          this.store.dispatch(
            minorError({ error: DeviceErrors.NOT_CONNECTED }),
          );
        },
      ),
    );
  }

  private getNewStateFromUserCreateServer(response: AuthenticationResponse) {
    match(response)
      .with({ status: 'error' }, (errorResponse) =>
        this.getNewStateFromError(errorResponse.error),
      )
      .with({ status: 'authenticated' }, (correctResponse) => {
        this.patchState({
          token: correctResponse.data,
        });
      })
      .exhaustive();
  }

  private getNewStateFromError(errorResponse: AuthenticationErrors) {
    match(errorResponse)
      .with(
        ServerErrors.UNKNOWN_ERROR,
        ServerErrors.INCORRECT_DATA_FORMAT_OF_SERVER,
        ServerErrors.INCORRECT_DATA_FORMAT_OF_CLIENT,
        (error) => {
          this.store.dispatch(minorError({ error }));
        },
      )
      .with(
        UserFormErrors.USER_NOT_FOUND,
        UserFormErrors.INCORRECT_PASSWORD,
        (error) => {
          this.patchState({
            error,
          });
        },
      )
      .exhaustive();
  }
}
