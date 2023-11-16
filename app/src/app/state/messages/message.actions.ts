import { createAction, props } from '@ngrx/store';

export const showMessages = createAction(
  '[Messages] Show Messages',
  props<{ message: string }>(),
);

export const clearMessage = createAction('[Messages] Clear Messages');
