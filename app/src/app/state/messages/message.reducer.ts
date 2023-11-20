import { createReducer, on } from '@ngrx/store';
import { showMessages } from './message.actions';

export type MessagesState = {
  message?: string;
};

export const messageReducer = createReducer(
  {},
  on(showMessages, (state, action) => ({
    message: action.message,
  })),
);
