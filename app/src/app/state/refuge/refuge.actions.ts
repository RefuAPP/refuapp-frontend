import { createAction, props } from '@ngrx/store';
import { Refuge } from '../../schemas/refuge/refuge';

export const setRefuge = createAction(
  '[Refuge] Setting current refuge',
  props<{ refuge: Refuge }>(),
);

export const removeRefuge = createAction('[Refuge] Removing current refuge');
