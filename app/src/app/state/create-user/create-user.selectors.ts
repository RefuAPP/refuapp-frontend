import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';

export const selectCreateUser = (state: AppState) => state.createUser;

export const getCreateUserFormErrors = createSelector(
  selectCreateUser,
  (createUser) => {
    if (createUser.error) return createUser.error;
    return null;
  },
);

export const getCreateUserDeviceErrors = createSelector(
  selectCreateUser,
  (createUser) => {
    if (createUser.deviceError) return createUser.deviceError;
    return null;
  },
);

export const getCreateUserForm = createSelector(
  selectCreateUser,
  (createUser) => {
    if (createUser.userCreateForm) return createUser.userCreateForm;
    return null;
  },
);
