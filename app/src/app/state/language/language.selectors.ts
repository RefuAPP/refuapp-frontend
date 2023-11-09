import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';

export const selectLanguage = (state: AppState) => state.language;

export const getCurrentLanguage = createSelector(
  selectLanguage,
  (language) => language.currentLanguageCode,
);
