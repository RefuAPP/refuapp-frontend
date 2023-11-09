import { createReducer, on } from '@ngrx/store';
import {
  changeLanguageCorrect,
  changeLanguageError,
  changeLanguageRequest,
  forcedLanguage,
  forceLanguageRequest,
  removeForceLanguage,
} from './language.actions';

export type LanguageState = {
  isChanging: boolean;
  nextLanguageCode?: string;
  error?: any;
  currentLanguageCode: string;
  defaultLanguageCode?: string;
  forcedLanguage: boolean;
};

export const englishLanguageState = {
  isChanging: false,
  currentLanguageCode: 'en',
  forcedLanguage: false,
} as LanguageState;

export const languageReducer = createReducer(
  englishLanguageState,
  on(changeLanguageRequest, (state, action) => ({
    ...state,
    isChanging: true,
    nextLanguageCode: action.languageCode,
  })),
  on(changeLanguageError, (state, action) => ({
    ...state,
    error: action.error,
    nextLanguageCode: undefined,
    isChanging: false,
  })),
  on(changeLanguageCorrect, (state, action) => ({
    ...state,
    currentLanguageCode: action.languageCode,
    nextLanguageCode: undefined,
    isChanging: false,
  })),
  on(forceLanguageRequest, (state, action) => ({
    ...state,
    nextLanguageCode: action.languageCode,
    isChanging: true,
  })),
  on(forcedLanguage, (state, action) => ({
    ...state,
    currentLanguageCode: action.languageCode,
    nextLanguageCode: undefined,
    isChanging: false,
    forcedLanguage: true,
  })),
  on(removeForceLanguage, (state, action) => ({
    ...state,
    forcedLanguage: false,
  })),
);
