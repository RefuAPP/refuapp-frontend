import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';

export const selectInitStatus = (state: AppState) => state.initStatus;

export const librariesLoaded = createSelector(
  selectInitStatus,
  (initStatus) => initStatus.mapLibraryFetched,
);

export const allMapsAreLoaded = createSelector(
  selectInitStatus,
  (initStatus) => initStatus.refugesOnMap,
);
