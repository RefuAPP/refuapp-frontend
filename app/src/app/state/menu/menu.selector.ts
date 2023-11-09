import { createSelector } from '@ngrx/store';
import { selectAuth } from '../auth/auth.selectors';

export type MenuItem = {
  titleTranslateKey: string;
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
