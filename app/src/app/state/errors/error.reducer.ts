import { createReducer, on } from '@ngrx/store';
import { cleanError, resourceNotFound, unknownError } from './error.actions';

export type ErrorState = {
  hasError: boolean;
  type: 'resourceNotFound' | 'programmingError' | 'unknownError' | undefined;
};

export const reservationState = {
  hasError: false,
} as ErrorState;

export const errorReducer = createReducer(
  reservationState,
  on(unknownError, (state, action) => ({
    hasError: true,
    type: 'unknownError',
  })),
  on(resourceNotFound, (state, action) => ({
    hasError: true,
    type: 'resourceNotFound',
  })),
  on(resourceNotFound, (state, action) => ({
    hasError: true,
    type: 'programmingError',
  })),
  on(cleanError, (state, action) => ({
    hasError: false,
    type: undefined,
  })),
);
