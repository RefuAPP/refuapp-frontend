import { createAction, props } from '@ngrx/store';
import { Token } from '../../schemas/auth/token';
import { UserCredentials } from '../../schemas/user/user';
import { NonUserFormErrors, UserFormErrors } from '../../schemas/auth/errors';
import { CredentialsError } from '../../schemas/auth/validate/forms';

export const loginRequest = createAction(
  '[Auth] User Login Request',
  props<{ credentials: UserCredentials }>(),
);

export const httpLoginRequest = createAction(
  '[Auth] HTTP Login Request',
  props<{ credentials: UserCredentials }>(),
);

export const loginResponseError = createAction(
  '[Auth] Login Response Failure',
  props<{
    error: UserFormErrors | CredentialsError;
    credentials: UserCredentials;
  }>(),
);

export const loginResponseDeviceError = createAction(
  '[Auth] Login Response Device Failure',
  props<{
    error: NonUserFormErrors;
  }>(),
);

export const loginResponseCorrect = createAction(
  '[Auth] Login Response Success',
  props<{ token: Token }>(),
);

export const loginCompleted = createAction(
  '[Auth] Login Completed',
  props<{ userId: string }>(),
);

export const logOutRequest = createAction('[Auth] LogOut Request');

export const logOutCompleted = createAction('[Auth] LogOut Completed');
