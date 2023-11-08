import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { match } from 'ts-pattern';
import { UserErrors } from '../../schemas/auth/errors';

export const selectAuth = (state: AppState) => state.auth;

export type MenuItem = {
  title: string;
  url: string;
  icon: string;
};

export const getTopItems = createSelector(selectAuth, (auth) => {
  return match(auth.state)
    .with('logged-in', () => {
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
    })
    .with('logged-out', () => {
      return [
        {
          title: 'Home',
          url: '/home',
          icon: 'home',
        },
      ];
    })
    .exhaustive();
});

export const getBottomItems = createSelector(selectAuth, (auth) => {
  return match(auth.state)
    .with('logged-in', () => {
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
    })
    .with('logged-out', () => {
      return [
        {
          title: 'Login',
          url: '/login',
          icon: 'log-in',
        },
      ];
    })
    .exhaustive();
});

export const getErrorName = createSelector(selectAuth, (auth) => {
  return match(auth)
    .with({ status: 'error' }, (loginError) => {
      return match(loginError.error)
        .with(UserErrors.USER_NOT_FOUND, () => 'User not found')
        .with(UserErrors.INCORRECT_PASSWORD, () => 'Incorrect password')
        .otherwise(() => null);
    })
    .otherwise(() => null);
});

export const isTryingAuthentication = createSelector(selectAuth, (auth) => {
  return match(auth)
    .with({ status: 'pending' }, () => true)
    .with({ status: 'complete' }, { status: 'error' }, () => false)
    .exhaustive();
});

export const isAuthenticated = createSelector(selectAuth, (auth) => {
  return match(auth)
    .with({ state: 'logged-in' }, () => true)
    .with({ state: 'logged-out' }, () => false)
    .exhaustive();
});
