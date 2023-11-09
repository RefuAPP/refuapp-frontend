import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';

export const selectInitStatus = (state: AppState) => state.initStatus;

export const appIsLoadingLibraries = createSelector(
  selectInitStatus,
  (initStatus) => initStatus.isLoading,
);
