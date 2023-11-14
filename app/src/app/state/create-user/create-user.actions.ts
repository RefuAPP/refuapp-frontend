import { createAction, props } from '@ngrx/store';
import { User, UserForm } from '../../schemas/user/user';
import { RepeatedData } from '../../schemas/user/create/create-user-error';
import { UserFormError } from '../../schemas/user/validate/form';

export const createUserRequest = createAction(
  '[User] Create User Request',
  props<{ credentials: UserForm }>(),
);

export const createUserDevicesError = createAction(
  '[User] Create User Device Error',
);

export const createUserError = createAction(
  '[User] Create User Error',
  props<{
    error: RepeatedData | UserFormError;
    credentials: UserForm;
  }>(),
);

export const createUserCorrect = createAction(
  '[User] Create User Correct',
  props<{
    credentials: User;
  }>(),
);
