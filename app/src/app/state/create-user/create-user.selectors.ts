import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { match } from 'ts-pattern';
import { UserFormError } from '../../schemas/user/validate/form';

export const selectCreateUser = (state: AppState) => state.createUser;

export const getCreateUserFormErrors = createSelector(
  selectCreateUser,
  (createUser) => {
    if (createUser.error)
      return match(createUser.error)
        .with('PHONE_ALREADY_EXISTS', () => 'SIGNUP.ALREADY_EXISTING_USER')
        .with({ type: 'INVALID_USER_DATA' }, (value) => value.message)
        .with(
          UserFormError.PASSWORDS_DO_NOT_MATCH,
          () => 'SIGNUP.PASSWORDS_DONT_MATCH',
        )
        .with(
          UserFormError.INCORRECT_PHONE_NUMBER,
          () => 'SIGNUP.PHONE_NUMBER.INCORRECT_PHONE_NUMBER',
        )
        .with(
          UserFormError.INCORRECT_EMERGENCY_NUMBER,
          () => 'SIGNUP.EMERGENCY_NUMBER.INCORRECT_PHONE_NUMBER',
        )
        .exhaustive();
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
