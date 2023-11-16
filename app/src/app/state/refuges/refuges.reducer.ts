import { Refuge } from '../../schemas/refuge/refuge';
import { createReducer, on } from '@ngrx/store';
import {
  loadedRefuges,
  loadRefuges,
  loadRefugesError,
} from './refuges.actions';
import { ServerErrors } from '../../schemas/errors/server';

export type RefugesState = {
  isFetching: boolean;
  error?: ServerErrors;
  refuges: Refuge[];
};

export const initialRefugesState = {
  isFetching: false,
  refuges: [],
} as RefugesState;

export const refugesReducer = createReducer(
  initialRefugesState,
  on(loadRefuges, (state) => ({
    ...state,
    isFetching: true,
    error: undefined,
  })),
  on(loadRefugesError, (state, action) => ({
    ...state,
    isFetching: false,
    error: action.error,
  })),
  on(loadedRefuges, (state, action) => ({
    isFetching: false,
    refuges: action.refuges,
  })),
);
