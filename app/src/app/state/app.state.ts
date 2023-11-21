import { AuthState } from './auth/auth.reducer';
import { LanguageState } from './language/language.reducer';
import { InitializerStatus } from './init/init.reducer';
import { MapStatus } from './map/map.reducer';
import { ErrorState } from './errors/error.reducer';
import { RefugesState } from './refuges/refuges.reducer';
import { MessagesState } from './messages/message.reducer';
import { ModalState } from './modal/modal.reducer';

export interface AppState {
  auth: AuthState;
  language: LanguageState;
  initStatus: InitializerStatus;
  map: MapStatus;
  modal: ModalState;
  refuges: RefugesState;
  error: ErrorState;
  messages: MessagesState;
}
