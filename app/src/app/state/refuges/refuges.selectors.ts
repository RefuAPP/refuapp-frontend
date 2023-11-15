import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';

export const selectRefuges = (state: AppState) => state.refuges;
export const getRefuges = createSelector(
  selectRefuges,
  (state) => state.refuges,
);
