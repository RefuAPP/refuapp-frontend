import { createAction, props } from '@ngrx/store';
import { Refuge } from '../../../schemas/refuge/refuge';

export const openModal = createAction(
  '[Modal] Open Modal',
  props<{ refuge: Refuge }>(),
);

export const closeModal = createAction('[Modal] Close Modal');
