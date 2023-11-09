import { createReducer, on } from '@ngrx/store';
import {
  loginCompleted,
  loginRequest,
  loginResponseCorrect,
  loginResponseDeviceError,
  loginResponseError,
  logOutCompleted,
  logOutRequest,
} from './auth.actions';
import { UserCredentials } from '../../schemas/user/user';
import { Token } from '../../schemas/auth/token';
import { NonUserFormErrors, UserFormErrors } from '../../schemas/auth/errors';

export type AuthState = {
  loginFormError?: UserFormErrors;
  deviceError?: NonUserFormErrors;
  userToken?: Token;
  userCredentials?: UserCredentials;
  userId?: string;
  isLoading: boolean;
  isAuthenticated: boolean;
};

export const notLoggedInState = {
  isLoading: false,
  isAuthenticated: false,
} as AuthState;

export const authReducer = createReducer(
  notLoggedInState,
  on(loginRequest, (state, action) => ({
    ...state,
    isLoading: true,
    userCredentials: action.credentials,
  })),
  on(loginResponseError, (state, action) => ({
    ...state,
    isLoading: false,
    loginFormError: action.error,
  })),
  on(loginResponseDeviceError, (state, action) => ({
    ...state,
    isLoading: false,
    deviceError: action.error,
  })),
  on(loginResponseCorrect, (state, action) => ({
    ...state,
    userToken: action.token,
  })),
  on(loginCompleted, (state, action) => ({
    isLoading: false,
    userId: action.userId,
    isAuthenticated: true,
  })),
  on(logOutRequest, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(logOutCompleted, (state) => ({
    ...notLoggedInState,
  })),
);
