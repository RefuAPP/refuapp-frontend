import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { selectInitStatus } from '../init/init.selectors';

export const selectMap = (state: AppState) => state.map;

export const isMapLoading = createSelector(
  selectInitStatus,
  selectMap,
  (initState, mapState) => {
    if (!initState.isFetchingLibraries && initState.mapLibraryLoaded)
      return false;
    return !mapState.areRefugesLoaded;
  },
);

export const getRefuges = createSelector(selectMap, (state) => state.refuges);
