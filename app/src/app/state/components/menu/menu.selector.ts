import { createSelector } from '@ngrx/store';
import { selectAuth } from '../../auth/auth.selectors';
import { selectLanguage } from '../../language/language.selectors';

export type MenuItem = {
  titleTranslateKey: string;
  url: string;
  icon: string;
};

export const getTopItems = createSelector(
  selectAuth,
  selectLanguage,
  (auth, _) => {
    if (auth.isAuthenticated) {
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
  },
);

export const getBottomItems = createSelector(selectAuth, (auth) => {
  if (auth.isAuthenticated)
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
