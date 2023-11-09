import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserService } from '../../services/user/user.service';
import { loginRequest } from '../auth/auth.actions';
import { map, of, switchMap } from 'rxjs';
import {
  createUserCorrect,
  createUserDeviceError,
  createUserError,
  createUserRequest,
} from './create-user.actions';
import { parseForm, UserFormError } from '../../schemas/user/validate/form';
import { isMatching, match } from 'ts-pattern';
import {
  CreateUser,
  CreateUserPattern,
  UserForm,
} from '../../schemas/user/user';
import { ServerErrors } from '../../schemas/errors/server';
import { CreateUserError } from '../../schemas/user/create/create-user-error';
import { CreateUserResponse } from '../../schemas/user/create/create-user-response';

@Injectable()
export class CreateUserEffects {
  constructor(
    private actions$: Actions,
    private userService: UserService,
  ) {}

  loginAutomaticWhenUserCreated$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createUserCorrect),
      map((createData) =>
        loginRequest({ credentials: createData.credentials }),
      ),
    ),
  );

  createUserRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createUserRequest),
      switchMap((createData) =>
        this.getNewStateFromCreateUserRequest(createData),
      ),
    ),
  );

  getNewStateFromCreateUserRequest(createData: { credentials: UserForm }) {
    const userCredentialsOrError = parseForm(createData.credentials);
    if (isMatching(CreateUserPattern, userCredentialsOrError))
      return this.fetchNewStateFromAuthApi(createData);
    return of(
      createUserError({
        error: userCredentialsOrError as UserFormError,
        credentials: createData.credentials,
      }),
    );
  }

  private fetchNewStateFromAuthApi(createUserData: { credentials: UserForm }) {
    return this.userService
      .create(parseForm(createUserData.credentials) as CreateUser)
      .pipe(
        map((response) =>
          this.getNewStateFromUserCreateServer(response, createUserData),
        ),
      );
  }

  private getNewStateFromUserCreateServer(
    response: CreateUserResponse,
    createUserData: {
      credentials: UserForm;
    },
  ) {
    return match(response)
      .with({ status: 'error' }, (errorResponse) =>
        this.getNewStateFromError(errorResponse.error, createUserData),
      )
      .with({ status: 'created' }, (correctResponse) =>
        createUserCorrect({
          credentials: {
            ...correctResponse.data,
            ...createUserData.credentials,
          },
        }),
      )
      .exhaustive();
  }

  private getNewStateFromError(
    errorResponse: CreateUserError,
    loginData: { credentials: UserForm },
  ) {
    return match(errorResponse)
      .with(
        ServerErrors.UNKNOWN_ERROR,
        ServerErrors.INCORRECT_DATA_FORMAT,
        (err) => createUserDeviceError({ error: err, ...loginData }),
      )
      .with('PHONE_ALREADY_EXISTS', (err) =>
        createUserError({ error: err, ...loginData }),
      )
      .with({ type: 'INVALID_USER_DATA' }, (err) =>
        createUserError({ error: err, ...loginData }),
      )
      .exhaustive();
  }
}
