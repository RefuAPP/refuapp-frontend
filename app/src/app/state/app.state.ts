import { AuthState } from './auth/auth.reducer';
import { CreateUserState } from './create-user/create-user.reducer';
import { LanguageState } from './language/language.reducer';
import { InitializerStatus } from './init/init.reducer';
import { ModalState } from './components/modal/modal.reducer';
import { MapStatus } from './map/map.reducer';
import { SearchState } from './components/search/search.reducer';

export interface AppState {
  auth: AuthState;
  createUser: CreateUserState;
  language: LanguageState;
  initStatus: InitializerStatus;
  map: MapStatus;
  modal: ModalState;
  searchCompletion: SearchState;
}
