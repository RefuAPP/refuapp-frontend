import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { match } from 'ts-pattern';
import { UserFormErrors } from '../../schemas/auth/errors';

export const selectAuth = (state: AppState) => state.auth;

export const getLoginFormErrorMessages = createSelector(selectAuth, (auth) => {
  return match(auth.loginFormError)
    .with(UserFormErrors.USER_NOT_FOUND, () => 'STRING_OF_USER_NOT_FOUND')
    .with(
      UserFormErrors.INCORRECT_PASSWORD,
      () => 'STRING_OF_INCORRECT_PASSWORD',
    )
    .with(undefined, () => null)
    .exhaustive();
});

export const getLoginErrors = createSelector(selectAuth, (auth) => {
  if (auth.deviceError) return auth.deviceError;
  return null;
});

export const isAuthenticated = createSelector(selectAuth, (auth) => {
  return auth.isAuthenticated;
});
