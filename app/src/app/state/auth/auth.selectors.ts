import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';

export const selectAuth = (state: AppState) => state.auth;

export const isAuthenticated = createSelector(selectAuth, (auth) => {
  return auth.userId !== undefined;
});

export const selectUserId = createSelector(selectAuth, (auth) => {
  return auth.userId;
});

export type MenuItem = {
  titleTranslateKey: string;
  url: string;
  icon: string;
};

export const getTopItems = createSelector(isAuthenticated, (auth) => {
  if (auth) {
    return [
      {
        titleTranslateKey: 'MENU.HOME',
        url: '/home',
        icon: 'home',
      },
      {
        titleTranslateKey: 'MENU.RESERVATIONS',
        url: '/reservations',
        icon: 'folder',
      },
    ] as MenuItem[];
  }
  return [
    {
      titleTranslateKey: 'MENU.HOME',
      url: '/home',
      icon: 'home',
    },
  ] as MenuItem[];
});

export const getBottomItems = createSelector(isAuthenticated, (auth) => {
  if (auth)
    return [
      {
        titleTranslateKey: 'MENU.PROFILE',
        url: '/profile',
        icon: 'person',
      },
      {
        titleTranslateKey: 'MENU.LOGOUT',
        url: '/logout',
        icon: 'log-out',
      },
    ] as MenuItem[];
  return [
    {
      titleTranslateKey: 'MENU.LOGIN',
      url: '/login',
      icon: 'log-in',
    },
  ] as MenuItem[];
});
