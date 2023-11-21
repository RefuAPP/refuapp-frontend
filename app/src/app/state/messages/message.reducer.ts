import { createReducer, on } from '@ngrx/store';
import { clearMessage, showMessages } from './message.actions';

export type Message = {
  message: string;
  id: number;
};

export type MessagesState = {
  message: Message[];
  counter: number;
};

export const messageReducer = createReducer(
  {
    message: [] as Message[],
    counter: 0,
  },
  on(showMessages, (state, action) => ({
    message: [{ id: state.counter + 1, message: action.message }].concat(
      state.message,
    ),
    counter: state.counter + 1,
  })),
  on(clearMessage, (state, action) => ({
    message: state.message.filter((message) => message.id !== action.id),
    counter: state.counter,
  })),
);
