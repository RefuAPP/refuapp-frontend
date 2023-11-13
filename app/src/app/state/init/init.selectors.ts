import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';

export const selectInitStatus = (state: AppState) => state.initStatus;

export const areLibrariesLoaded = createSelector(
  selectInitStatus,
  (initStatus) => initStatus.mapLibraryLoaded,
);

export const isLoadingLibraries = createSelector(
  selectInitStatus,
  (initStatus) => initStatus.isFetchingLibraries,
);
