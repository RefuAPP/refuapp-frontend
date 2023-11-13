import { createSelector } from '@ngrx/store';
import { AppState } from '../../app.state';

export const selectSearch = (state: AppState) => state.searchCompletion;

export const selectAutoCompletion = createSelector(
  selectSearch,
  (state) => state.completions,
);
export const selectCurrentSearch = createSelector(
  selectSearch,
  (state) => state.search,
);
