import { createReducer, on } from '@ngrx/store';
import { Refuge } from '../../schemas/refuge/refuge';
import { removeRefuge, setRefuge } from './refuge.actions';

export type RefugeState = {
  refuge?: Refuge;
};

export const refugeState = {} as RefugeState;

export const refugeReducer = createReducer(
  refugeState,
  on(setRefuge, (state, action) => ({
    ...state,
    refuge: action.refuge,
  })),
  on(removeRefuge, (state, action) => ({
    ...state,
    refuge: undefined,
  })),
);
