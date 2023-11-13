import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';

export const selectRefuge = (state: AppState) => state.refuge;

export const getCurrentRefuge = createSelector(selectRefuge, (state) => {
  if (state.refuge) return state.refuge;
  return null;
});
