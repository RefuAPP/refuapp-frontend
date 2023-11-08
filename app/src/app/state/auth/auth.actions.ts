import { createAction, props } from '@ngrx/store';
import { Token } from '../../schemas/auth/token';
import { UserCredentials } from '../../schemas/user/user';
import { AuthenticationErrors } from '../../schemas/auth/errors';

export const loginRequest = createAction(
  '[Auth] Login Request',
  props<UserCredentials>(),
);

export const loginResponseError = createAction(
  '[Auth] Login Response Failure',
  props<{
    error: AuthenticationErrors;
  }>(),
);

export const loginResponseCorrect = createAction(
  '[Auth] Login Response Success',
  props<Token>(),
);

export const loginCompleted = createAction('[Auth] Login Completed');

export const logOutRequest = createAction('[Auth] LogOut Request');

export const logOutCompleted = createAction('[Auth] LogOut Completed');
