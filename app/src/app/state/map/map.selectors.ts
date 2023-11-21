import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';

export const selectMap = (state: AppState) => state.map;

export const isMapLoading = createSelector(
  selectMap,
  (mapState) => mapState.loadingMap,
);
