import { createAction, props } from '@ngrx/store';
import { Refuge } from '../../schemas/refuge/refuge';
import { ServerErrors } from '../../schemas/errors/server';

export const loadRefuges = createAction('[Refuges] Fetch all refuges');

export const loadRefugesError = createAction(
  '[Refuges] Error loading refuges',
  props<{ error: ServerErrors }>(),
);

export const loadedRefuges = createAction(
  '[Refuges] Fetched new refuges',
  props<{ refuges: Refuge[] }>(),
);
