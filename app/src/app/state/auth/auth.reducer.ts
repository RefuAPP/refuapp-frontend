import { createReducer, on } from '@ngrx/store';
import {
  httpLoginRequest,
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
import { CredentialsError } from '../../schemas/auth/validate/forms';

export type AuthState = {
  loginFormError?: UserFormErrors | CredentialsError;
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
  userCredentials: {
    phone_number: '',
    password: '',
  },
} as AuthState;

export const authReducer = createReducer(
  notLoggedInState,
  on(loginRequest, (state, action) => ({
    ...state,
    isLoading: true,
    userCredentials: action.credentials,
  })),
  on(httpLoginRequest, (state, action) => ({
    ...state,
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
    isLoading: false,
    isAuthenticated: false,
    userCredentials: {
      phone_number: '',
      password: '',
    },
  })),
);
