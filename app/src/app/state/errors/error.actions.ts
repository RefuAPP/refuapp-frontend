import { createAction, props } from '@ngrx/store';
import { AllErrors } from '../../schemas/errors/all-errors';

export const fatalError = createAction(
  '[Error] Fatal Error',
  props<{ error: AllErrors }>(),
);

export const minorError = createAction(
  '[Error] Minor Error',
  props<{ error: AllErrors }>(),
);

export const customMinorError = createAction(
  '[Error] Custom Minor Error',
  props<{ error: string }>(),
);
