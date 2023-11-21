import { createReducer, on } from '@ngrx/store';
import { closeModal, openModal, openModalWithRefugeId } from './modal.actions';
import { Refuge } from '../../schemas/refuge/refuge';

export type ModalState = {
  refuge?: Refuge;
  isLoading: boolean;
  isOpen: boolean;
};

export const refugeState = {
  isLoading: false,
  isOpen: false,
} as ModalState;

export const modalReducer = createReducer(
  refugeState,
  on(openModal, (state, action) => ({
    isLoading: false,
    refuge: action.refuge,
    isOpen: true,
  })),
  on(openModalWithRefugeId, (state, action) => ({
    ...state,
    isLoading: true,
  })),
  on(closeModal, (state, action) => ({
    isLoading: false,
    isOpen: false,
  })),
);
