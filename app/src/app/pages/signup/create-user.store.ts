import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { filter, Observable, of, OperatorFunction, switchMap, tap } from 'rxjs';
import {
  CreateUser,
  CreateUserPattern,
  User,
  UserForm,
} from '../../schemas/user/user';
import { CreateUserError } from '../../schemas/user/create/create-user-error';
import { parseForm, UserFormError } from '../../schemas/user/validate/form';
import { isMatching, match } from 'ts-pattern';
import { ServerErrors } from '../../schemas/errors/server';
import { UserService } from '../../services/user/user.service';
import { CreateUserResponse } from '../../schemas/user/create/create-user-response';
import { Injectable } from '@angular/core';
import { EMPTY_OBSERVER } from 'rxjs/internal/Subscriber';
import { DeviceErrors } from '../../schemas/errors/device';
import { minorError } from '../../state/errors/error.actions';
import { AppState } from '@capacitor/app';
import { Store } from '@ngrx/store';

export interface CreateUserState {
  userCreateForm: UserForm;
  error?: UserFormError | CreateUserError;
  createdUser?: User;
  isLoading: boolean;
}

@Injectable()
export class CreateUserComponentStore extends ComponentStore<CreateUserState> {
  readonly form$: Observable<UserForm> = this.select(
    (state) => state.userCreateForm,
  );
  readonly error$: Observable<UserFormError | CreateUserError> = this.select(
    (state) => state.error,
  ).pipe(
    filter((error) => error !== undefined) as OperatorFunction<
      UserFormError | CreateUserError | undefined,
      UserFormError | CreateUserError
    >,
  );
  readonly isLoading$: Observable<boolean> = this.select(
    (state) => state.isLoading,
  );
  readonly createdUser$: Observable<User> = this.select(
    (state) => state.createdUser,
  ).pipe(
    filter((user) => user !== undefined) as OperatorFunction<
      User | undefined,
      User
    >,
  );

  constructor(
    readonly userService: UserService,
    readonly store: Store<AppState>,
  ) {
    super({
      userCreateForm: {
        username: '',
        password: '',
        repeatPassword: '',
        phone_number: '',
        emergency_number: '',
      },
      isLoading: false,
    });
  }

  readonly createUserRequest = this.effect((form: Observable<UserForm>) =>
    form.pipe(
      tap((form) => this.patchState({ userCreateForm: form })),
      tap(() => console.log('New request arrived!')),
      switchMap((form: UserForm) =>
        this.getNewStateFromCreateUserRequest(form),
      ),
    ),
  );

  private getNewStateFromCreateUserRequest(credentials: UserForm) {
    const userCredentialsOrError = parseForm(credentials);
    if (isMatching(CreateUserPattern, userCredentialsOrError)) {
      return this.fetchNewStateFromAuthApi(
        userCredentialsOrError as CreateUser,
      );
    } else {
      this.patchState({
        error: userCredentialsOrError as UserFormError,
      });
      return of(EMPTY_OBSERVER);
    }
  }

  private fetchNewStateFromAuthApi(credentials: CreateUser) {
    this.patchState({
      isLoading: true,
    });
    return this.userService.create(credentials).pipe(
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

  private getNewStateFromUserCreateServer(response: CreateUserResponse) {
    match(response)
      .with({ status: 'error' }, (errorResponse) =>
        this.getNewStateFromError(errorResponse.error),
      )
      .with({ status: 'created' }, (correctResponse) => {
        console.log('Patching correct response');
        this.patchState((state) => {
          return {
            createdUser: {
              ...correctResponse.data,
              password: state.userCreateForm.password,
            },
          };
        });
      })
      .exhaustive();
  }

  private getNewStateFromError(errorResponse: CreateUserError) {
    match(errorResponse)
      .with(
        ServerErrors.INCORRECT_DATA_FORMAT_OF_SERVER,
        ServerErrors.INCORRECT_DATA_FORMAT_OF_CLIENT,
        ServerErrors.UNKNOWN_ERROR,
        (error) => {
          this.store.dispatch(minorError({ error }));
        },
      )
      .with('PHONE_ALREADY_EXISTS', (err) =>
        this.patchState({
          error: err,
        }),
      )
      .with({ type: 'INVALID_USER_DATA' }, (err) =>
        this.patchState({
          error: err,
        }),
      )
      .exhaustive();
  }
}
