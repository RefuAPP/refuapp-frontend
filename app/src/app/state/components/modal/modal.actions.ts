import { createAction, props } from '@ngrx/store';
import { Refuge } from '../../../schemas/refuge/refuge';

export const openModal = createAction(
  '[Modal] Open Modal',
  props<{ refuge: Refuge }>(),
);

export const openModalWithRefugeId = createAction(
  '[Modal] Open Modal with refuge id',
  props<{ refugeId: string }>(),
);

export const closeModal = createAction(
  '[Modal] Close Modal',
  props<{ redirectHome: boolean }>(),
);
