import { createSelector } from '@ngrx/store';
import { selectAuth } from '../auth/auth.selectors';

export type LoadingState = {
  isLoading: boolean;
  keyMessage?: string;
};

export const isLoading = createSelector(selectAuth, (auth) => {
  if (auth.isLoading)
    return { isLoading: true, keyMessage: 'LOADING_AUTH' } as LoadingState;
  return { isLoading: false } as LoadingState;
});
