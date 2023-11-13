import { createReducer, on } from '@ngrx/store';
import { closeModal, openModal } from './modal.actions';
import { Refuge } from '../../../schemas/refuge/refuge';

export type ModalState = {
  refuge?: Refuge;
  isOpen: boolean;
};

export const refugeState = {
  isOpen: false,
} as ModalState;

export const modalReducer = createReducer(
  refugeState,
  on(openModal, (state, action) => ({
    refuge: action.refuge,
    isOpen: true,
  })),
  on(closeModal, (state, action) => ({
    isOpen: false,
  })),
);
