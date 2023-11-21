import { createReducer, on } from '@ngrx/store';
import { loginCompleted, logOutCompleted } from './auth.actions';

export type AuthState = {
  userId?: string;
};

export const notLoggedInState = {} as AuthState;

export const authReducer = createReducer(
  notLoggedInState,
  on(loginCompleted, (state, action) => ({
    userId: action.userId,
  })),
  on(logOutCompleted, (state) => ({})),
);
