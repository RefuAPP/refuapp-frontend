import { createAction, props } from '@ngrx/store';
import { User, UserCreated, UserForm } from '../../schemas/user/user';
import { RepeatedData } from '../../schemas/user/create/create-user-error';
import { UserFormError } from '../../schemas/user/validate/form';
import { ServerErrors } from '../../schemas/errors/server';

export const createUserRequest = createAction(
  '[User] Create User Request',
  props<{ credentials: UserForm }>(),
);

export const createUserError = createAction(
  '[User] Create User Error',
  props<{
    error: RepeatedData | UserFormError;
    credentials: UserForm;
  }>(),
);

export const createUserDeviceError = createAction(
  '[User] Create User Device Error',
  props<{
    error: ServerErrors;
    credentials: UserForm;
  }>(),
);

export const createUserCorrect = createAction(
  '[Auth] Device Error When Login',
  props<{
    credentials: User;
  }>(),
);
