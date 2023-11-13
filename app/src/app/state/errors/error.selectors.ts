import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';

export const selectError = (state: AppState) => state.error;

export const hasError = createSelector(
  selectError,
  (errorState) => errorState.hasError,
);
