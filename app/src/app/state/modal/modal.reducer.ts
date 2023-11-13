import { createReducer, on } from '@ngrx/store';
import { close, setOpen } from './modal.actions';

export type ModalState = {
  open: boolean;
};

export const refugeState = {
  open: false,
} as ModalState;

export const modalReducer = createReducer(
  refugeState,
  on(setOpen, (state, action) => ({
    open: true,
  })),
  on(close, (state, action) => ({
    open: false,
  })),
);
