import { createAction, props } from '@ngrx/store';
import { Token } from '../../schemas/auth/token';

export const login = createAction(
  '[Auth] Login Request',
  props<{ token: Token }>(),
);

export const loginFailed = createAction('[Auth] Login Failed');

export const loginCompleted = createAction(
  '[Auth] Login Completed',
  props<{ userId: string }>(),
);

export const logOutRequest = createAction('[Auth] LogOut Request');

export const logOutCompleted = createAction('[Auth] LogOut Completed');
