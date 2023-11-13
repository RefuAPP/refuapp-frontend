import { AuthState } from './auth/auth.reducer';
import { CreateUserState } from './create-user/create-user.reducer';
import { LanguageState } from './language/language.reducer';
import { InitializerStatus } from './init/init.reducer';
import { RefugeState } from './refuge/refuge.reducer';
import { ModalState } from './modal/modal.reducer';

export interface AppState {
  auth: AuthState;
  createUser: CreateUserState;
  language: LanguageState;
  initStatus: InitializerStatus;
  refuge: RefugeState;
  modal: ModalState;
}
