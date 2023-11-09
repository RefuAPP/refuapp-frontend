import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { match } from 'ts-pattern';
import { UserFormErrors } from '../../schemas/auth/errors';

export const selectAuth = (state: AppState) => state.auth;

export type MenuItem = {
  title: string;
  url: string;
  icon: string;
};

export const getTopItems = createSelector(selectAuth, (auth) => {
  if (auth.isAuthenticated) {
    return [
      {
        title: 'Home',
        url: '/home',
        icon: 'home',
      },
      {
        title: 'Reservations',
        url: '/reservations',
        icon: 'folder',
      },
    ];
  }
  return [
    {
      title: 'Home',
      url: '/home',
      icon: 'home',
    },
  ];
});

export const getBottomItems = createSelector(selectAuth, (auth) => {
  if (auth.isAuthenticated)
    return [
      {
        title: 'Profile',
        url: '/profile',
        icon: 'person',
      },
      {
        title: 'Logout',
        url: '/logout',
        icon: 'log-out',
      },
    ];
  return [
    {
      title: 'Login',
      url: '/login',
      icon: 'log-in',
    },
  ];
});

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

export const isLoading = createSelector(selectAuth, (auth) => {
  return auth.isLoading;
});
