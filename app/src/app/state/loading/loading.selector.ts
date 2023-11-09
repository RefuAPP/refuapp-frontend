import { createSelector } from '@ngrx/store';
import { selectAuth } from '../auth/auth.selectors';
import { selectCreateUser } from '../create-user/create-user.selectors';

export type LoadingState = {
  isLoading: boolean;
  keyMessage?: string;
};

export const isLoading = createSelector(
  selectAuth,
  selectCreateUser,
  (auth, create) => {
    if (auth.isLoading)
      return { isLoading: true, keyMessage: 'LOADING_AUTH' } as LoadingState;
    if (create.isLoading)
      return {
        isLoading: true,
        keyMessage: 'LOADING_CREATE_USER',
      } as LoadingState;
    return { isLoading: false } as LoadingState;
  },
);
