import { createAction, props } from '@ngrx/store';
import { GetAllRefugesErrors } from '../../schemas/refuge/get-all-refuges-schema';
import { Refuge } from '../../schemas/refuge/refuge';

export const loadRefuges = createAction('[Refuges] Fetch all refuges');

export const loadRefugesError = createAction(
  '[Refuges] Error loading refuges',
  props<{ error: GetAllRefugesErrors }>(),
);

export const loadedRefuges = createAction(
  '[Refuges] Fetched new refuges',
  props<{ refuges: Refuge[] }>(),
);
