import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';

export const selectMessages = (state: AppState) => state.messages;

export const getMessages = createSelector(selectMessages, (messagesState) => {
  if (messagesState.message.length !== 0) return messagesState.message[0];
  return undefined;
});
