import { AuthState } from './auth/auth.reducer';
import { CreateUserState } from './create-user/create-user.reducer';

export interface AppState {
  auth: AuthState;
  createUser: CreateUserState;
}
