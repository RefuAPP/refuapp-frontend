import { createReducer, on } from '@ngrx/store';
import {
  loginCompleted,
  loginRequest,
  loginResponseCorrect,
  loginResponseError,
  logOutCompleted,
  logOutRequest,
} from './auth.actions';
import { UserCredentials } from '../../schemas/user/user';
import { Token } from '../../schemas/auth/token';
import { AuthenticationErrors } from '../../schemas/auth/errors';

export type LoggedOut = {
  state: 'logged-out';
  status: 'complete';
};

interface LoggedIn {
  state: 'logged-in';
  status: 'complete';
}

export type ErrorLoginIn = {
  error: AuthenticationErrors;
  state: 'logged-out';
  status: 'error';
};

export type LoginRequest = {
  state: 'logged-out';
  status: 'pending';
  userCredentials: UserCredentials;
};

export type LoginResponse = {
  state: 'logged-out';
  status: 'pending';
  token: Token;
};

export type LogOutRequest = {
  state: 'logged-in';
  status: 'pending';
};

export type AuthState =
  | LoggedOut
  | LoggedIn
  | ErrorLoginIn
  | LoginRequest
  | LoginResponse
  | LogOutRequest;

export const initialState = {
  state: 'logged-out',
} as AuthState;

export const authReducer = createReducer(
  initialState,
  on(loginRequest, (_, credentials) => ({
    state: 'logged-out',
    status: 'pending',
    userCredentials: credentials,
  })),
  on(loginResponseError, (_, credentials) => ({
    state: 'logged-out',
    status: 'error',
    error: credentials.error,
  })),
  on(loginResponseCorrect, (_, token) => ({
    state: 'logged-out',
    status: 'pending',
    token,
  })),
  on(loginCompleted, (_) => ({
    state: 'logged-in',
    status: 'complete',
  })),
  on(logOutRequest, (_) => ({
    state: 'logged-in',
    status: 'pending',
  })),
  on(logOutCompleted, (_) => ({
    state: 'logged-out',
    status: 'complete',
  })),
);
