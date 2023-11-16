import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';

export const selectAuth = (state: AppState) => state.auth;

export const isAuthenticated = createSelector(selectAuth, (auth) => {
  return auth.userId !== undefined;
});

export const selectUserId = createSelector(selectAuth, (auth) => {
  return auth.userId;
});
