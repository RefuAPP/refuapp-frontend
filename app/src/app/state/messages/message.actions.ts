import { createAction, props } from '@ngrx/store';

export const showMessages = createAction(
  '[Messages] Show Messages',
  props<{ message: string }>(),
);
