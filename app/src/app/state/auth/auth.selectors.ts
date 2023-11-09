import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { match } from 'ts-pattern';
import { UserFormErrors } from '../../schemas/auth/errors';
import { CredentialsError } from '../../schemas/auth/validate/forms';

export const selectAuth = (state: AppState) => state.auth;

export const getLoginFormErrorMessages = createSelector(selectAuth, (auth) => {
  return match(auth.loginFormError)
    .with(
      UserFormErrors.USER_NOT_FOUND,
      () => 'LOGIN.USERNAME.ERROR_DOESNT_EXIST',
    )
    .with(
      UserFormErrors.INCORRECT_PASSWORD,
      () => 'LOGIN.PASSWORD.ERROR_INCORRECT_PASSWORD',
    )
    .with(
      CredentialsError.INCORRECT_PHONE_NUMBER,
      () => 'LOGIN.USERNAME.ERROR_FORMATTED',
    )
    .with(undefined, () => null)
    .exhaustive();
});

export const getLoginDeviceErrors = createSelector(selectAuth, (auth) => {
  if (auth.deviceError) return auth.deviceError;
  return null;
});

export const isAuthenticated = createSelector(selectAuth, (auth) => {
  return auth.isAuthenticated;
});

export const getCurrentCredentials = createSelector(selectAuth, (auth) => {
  if (auth.userCredentials) {
    return auth.userCredentials;
  }
  return null;
});
