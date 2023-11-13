import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';

export const selectMap = (state: AppState) => state.map;

export const isMapReady = createSelector(
  selectMap,
  (mapState) => mapState.refugesOnMap,
);
