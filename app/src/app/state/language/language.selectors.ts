import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';

export const selectLanguage = (state: AppState) => state.language;

export const getCurrentLanguage = createSelector(
  selectLanguage,
  (language) => language.currentLanguageCode,
);

export const isForcedLanguage = createSelector(
  selectLanguage,
  (language) => language.forcedLanguage,
);

export const currentLanguage = createSelector(
  selectLanguage,
  (language) => language.currentLanguageCode,
);
