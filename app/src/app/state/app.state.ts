import { AuthState } from './auth/auth.reducer';
import { LanguageState } from './language/language.reducer';
import { InitializerStatus } from './init/init.reducer';
import { ModalState } from './components/modal/modal.reducer';
import { MapStatus } from './map/map.reducer';
import { ReservationsState } from './reservations/reservations.reducer';
import { ErrorState } from './errors/error.reducer';
import { RefugesState } from './refuges/refuges.reducer';
import { MessagesState } from './messages/message.reducer';

export interface AppState {
  auth: AuthState;
  language: LanguageState;
  initStatus: InitializerStatus;
  map: MapStatus;
  modal: ModalState;
  refuges: RefugesState;
  reservations: ReservationsState;
  error: ErrorState;
  messages: MessagesState;
}
