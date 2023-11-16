import { createReducer, on } from '@ngrx/store';
import { AllErrors } from '../../schemas/errors/all-errors';
import { customMinorError, fatalError, minorError } from './error.actions';

export type ErrorState = {
  hasError: boolean;
  fatalError?: AllErrors;
  minorError?: AllErrors;
  customMinorError?: string;
};

export const reservationState = {
  hasError: false,
} as ErrorState;

export const errorReducer = createReducer(
  reservationState,
  on(fatalError, (state, action) => ({
    hasError: true,
    fatalError: action.error,
  })),
  on(minorError, (state, action) => ({
    hasError: true,
    minorError: action.error,
  })),
  on(customMinorError, (state, action) => ({
    hasError: true,
    customMinorError: action.error,
  })),
);
