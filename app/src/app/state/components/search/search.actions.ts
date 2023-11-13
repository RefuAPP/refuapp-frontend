import { createAction, props } from '@ngrx/store';
import { Completion } from './search.reducer';

export const addSearch = createAction(
  '[Search] Adding Search String',
  props<{
    search: string;
  }>(),
);

export const addSearchCompletions = createAction(
  '[Search] Adding Search Completions',
  props<{
    completions: Completion[];
  }>(),
);

export const clearSearch = createAction('[Search] Clearing Searches');
