import { createAction, props } from '@ngrx/store';

export const showMessages = createAction(
  '[Messages] Show Messages',
  props<{ message: string; props?: any }>(),
);

export const clearMessage = createAction(
  '[Messages] Clearing Message',
  props<{ id: number }>(),
);
