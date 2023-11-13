import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';

export const selectModal = (state: AppState) => state.modal;

export const isModalOpened = createSelector(selectModal, (state) => state.open);
