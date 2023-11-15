import { createAction, props } from '@ngrx/store';

export const changeLanguageRequest = createAction(
  '[Language] Change Language Request',
  props<{ languageCode: string }>(),
);

export const changeLanguageError = createAction(
  '[Language] Change Language Error',
  props<{ error: any; languageCode: string }>(),
);

export const changeLanguageCorrect = createAction(
  '[Language] Change Language Correct',
  props<{ languageCode: string }>(),
);

export const forceLanguageRequest = createAction(
  '[Language] Force Language Request',
  props<{ languageCode: string }>(),
);

export const forcedLanguage = createAction(
  '[Language] A Language is Forced',
  props<{ languageCode: string }>(),
);

export const removeForceLanguage = createAction(
  '[Language] Remove Forced Language',
);
