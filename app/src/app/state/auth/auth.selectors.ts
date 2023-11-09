import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { match } from 'ts-pattern';
import { UserFormErrors } from '../../schemas/auth/errors';
import { CredentialsError } from '../../schemas/auth/validate/forms';

export const selectAuth = (state: AppState) => state.auth;

export const getLoginFormErrorMessages = createSelector(selectAuth, (auth) => {
  return match(auth.loginFormError)
    .with(UserFormErrors.USER_NOT_FOUND, () => 'STRING_OF_USER_NOT_FOUND')
    .with(
      UserFormErrors.INCORRECT_PASSWORD,
      () => 'STRING_OF_INCORRECT_PASSWORD',
    )
    .with(
      CredentialsError.INCORRECT_PHONE_NUMBER,
      () => 'STRING_OF_INVALID_PHONE_NUMBER',
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
  if (auth.userCredentials) return auth.userCredentials;
  return null;
});
