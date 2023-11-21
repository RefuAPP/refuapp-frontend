import { createReducer, on } from '@ngrx/store';
import { AllErrors } from '../../schemas/errors/all-errors';
import {
  customMinorError,
  fatalError,
  fixFatalError,
  fixMinorError,
} from './error.actions';

export type MinorError = {
  id: number;
  message: string;
};

export type ErrorState = {
  fatalError?: AllErrors;
  minorErrors: MinorError[];
  counter: number;
};

export const reservationState = {
  minorErrors: [],
  counter: 0,
} as ErrorState;

export const errorReducer = createReducer(
  reservationState,
  on(fatalError, (state, action) => ({
    ...state,
    fatalError: action.error,
  })),
  on(customMinorError, (state, action) => ({
    ...state,
    counter: state.counter + 1,
    minorErrors: [{ id: state.counter, message: action.error }].concat(
      state.minorErrors,
    ),
  })),
  on(fixFatalError, (state, action) => ({
    counter: 0,
    minorErrors: [],
  })),
  on(fixMinorError, (state, action) => ({
    ...state,
    minorErrors: state.minorErrors.filter((error) => error.id !== action.id),
  })),
);
