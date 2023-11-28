import { AuthState } from './auth/auth.reducer';
import { LanguageState } from './language/language.reducer';
import { ErrorState } from './errors/error.reducer';
import { MessagesState } from './messages/message.reducer';

export interface AppState {
  auth: AuthState;
  language: LanguageState;
  error: ErrorState;
  messages: MessagesState;
}
