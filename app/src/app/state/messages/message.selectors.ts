import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';

export const selectMessages = (state: AppState) => state.messages;

export const getMessages = createSelector(
  selectMessages,
  (messagesState) => messagesState.message,
);

export const hasMessages = createSelector(
  selectMessages,
  (messagesState) => messagesState.message !== undefined,
);
