import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { selectInitStatus } from '../init/init.selectors';

export const selectMap = (state: AppState) => state.map;

export const isMapLoading = createSelector(
  selectInitStatus,
  selectMap,
  (initState, mapState) => {
    return mapState.loadingMap && !mapState.refugesOnMap;
  },
);
